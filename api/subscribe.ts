import type { VercelRequest, VercelResponse } from "@vercel/node";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Sending identity for the welcome email. FROM requires a verified domain in
// Resend; override via env if you send from a different address.
const FROM_EMAIL = process.env.RESEND_FROM || 'David Orkwar <noreply@davidorkwar.com>';
const REPLY_TO = "orkwardavidt@gmail.com";

/**
 * Captures a reader's email: adds them to Resend as a global Contact
 * (campaign-ready) and sends a welcome email. Both run against Resend with the
 * server-side RESEND_API_KEY. The welcome email is best-effort — if it fails
 * (e.g. sending domain not yet verified) the signup still succeeds.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return res.status(500).json({ error: "Email service not configured" });
  }

  const body =
    typeof req.body === "string" ? safeParse(req.body) : req.body ?? {};
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  // Store the contact and send the welcome email concurrently. Only the
  // contact result decides the HTTP status; the welcome email never blocks it.
  const [result] = await Promise.all([
    createContact(email, apiKey),
    sendWelcomeEmail(email, apiKey),
  ]);

  return res.status(result.status).json(result.body);
}

async function createContact(
  email: string,
  apiKey: string
): Promise<{ status: number; body: Record<string, unknown> }> {
  try {
    const r = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    });

    if (r.ok) return { status: 200, body: { ok: true } };

    // Resend returns 4xx for validation/duplicates. An already-existing
    // contact is a fine outcome for us — let the reader through.
    const data = (await r.json().catch(() => ({}))) as Record<string, unknown>;
    const msg = String(data.message ?? data.error ?? "").toLowerCase();
    if (r.status === 409 || msg.includes("already") || msg.includes("exist")) {
      return { status: 200, body: { ok: true, duplicate: true } };
    }

    console.error("Resend contact create failed", r.status, data);
    return { status: 502, body: { error: "Could not save email" } };
  } catch (err) {
    console.error("Resend contact request error", err);
    return { status: 502, body: { error: "Could not save email" } };
  }
}

async function sendWelcomeEmail(email: string, apiKey: string): Promise<void> {
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        reply_to: REPLY_TO,
        subject: "You're on the reader's list — David Orkwar",
        html: welcomeEmailHtml(),
      }),
    });
    if (!r.ok) {
      const err = await r.text().catch(() => "");
      console.error("Welcome email failed", r.status, err);
    }
  } catch (err) {
    // Best-effort: never let a welcome-email failure break the signup.
    console.error("Welcome email request error", err);
  }
}

function welcomeEmailHtml(): string {
  const year = new Date().getFullYear();
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,serif;color:#e8e2d6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;padding:48px 32px;">
    <tr>
      <td>
        <p style="font-family:'Helvetica Neue',sans-serif;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:#c8a96e;margin:0 0 32px;">
          David <em>"The k!nG"</em> Orkwar
        </p>

        <h1 style="font-size:32px;font-weight:400;margin:0 0 24px;line-height:1.3;color:#e8e2d6;">
          Welcome to<br/>
          <em style="color:#c8a96e;">the reader's list.</em>
        </h1>

        <p style="font-size:17px;line-height:1.8;color:#a09880;margin:0 0 20px;">
          You're in. From this point on, you'll be the first to know — new releases,
          chapters before anyone else sees them, and occasional notes from the desk in Abuja.
        </p>

        <p style="font-size:17px;line-height:1.8;color:#a09880;margin:0 0 32px;">
          If you haven't read <em>The Longest Flight</em> yet, now is the time.
          A high-altitude romance of shadows and fated poetry, available now.
        </p>

        <a href="mailto:${REPLY_TO}?subject=A%20word%20from%20a%20reader"
           style="display:inline-block;background:#c8a96e;color:#0a0a0a;padding:14px 28px;
                  font-family:'Helvetica Neue',sans-serif;font-size:10px;letter-spacing:0.28em;
                  text-transform:uppercase;text-decoration:none;">
          Write to the desk →
        </a>

        <hr style="border:none;border-top:1px solid #2a2a2a;margin:48px 0 24px;"/>

        <p style="font-family:'Helvetica Neue',sans-serif;font-size:10px;letter-spacing:0.14em;
                  color:#4a4a4a;margin:0;">
          © ${year} David Orkwar. All rights reserved.<br/>
          You subscribed at davidorkwar.com.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function safeParse(s: string): Record<string, unknown> {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
