import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "David Orkwar <noreply@davidorkwar.com>";
const AUTHOR_EMAIL = "orkwardavidt@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        reply_to: AUTHOR_EMAIL,
        subject: "You're on the reader's list — David Orkwar",
        html: `
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

        <a href="mailto:orkwardavidt@gmail.com?subject=A%20word%20from%20a%20reader"
           style="display:inline-block;background:#c8a96e;color:#0a0a0a;padding:14px 28px;
                  font-family:'Helvetica Neue',sans-serif;font-size:10px;letter-spacing:0.28em;
                  text-transform:uppercase;text-decoration:none;">
          Write to the desk →
        </a>

        <hr style="border:none;border-top:1px solid #2a2a2a;margin:48px 0 24px;"/>

        <p style="font-family:'Helvetica Neue',sans-serif;font-size:10px;letter-spacing:0.14em;
                  color:#4a4a4a;margin:0;">
          © ${new Date().getFullYear()} David Orkwar. All rights reserved.<br/>
          You subscribed at davidorkwar.com.
          <a href="" style="color:#4a4a4a;">Unsubscribe</a>.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
