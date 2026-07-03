import { FormEvent, useState } from "react";

interface ContactFormProps {
  to?: string;
}

const labelStyle: React.CSSProperties = {
  fontFamily: "'Spline Sans Mono', monospace",
  fontSize: ".64rem",
  letterSpacing: ".3em",
  textTransform: "uppercase",
  color: "hsl(220 6% 38%)",
};

const fieldStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid hsl(35 12% 82%)",
  padding: ".55rem 0",
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "1.3rem",
  lineHeight: 1.5,
  color: "hsl(220 9% 18%)",
  outline: "none",
  borderRadius: 0,
};

const isValidEmail = (email: string) =>
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());

const ContactForm = ({ to = "orkwardavidt@gmail.com" }: ContactFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !isValidEmail(email) || !msg.trim()) {
      setErr("Please add your name, a valid email, and a message.");
      return;
    }
    const subject = encodeURIComponent("A letter — " + name.trim());
    const body = encodeURIComponent(
      msg.trim() + "\n\n— " + name.trim() + "\n" + email.trim()
    );
    try {
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    } catch {
      /* noop */
    }
    setErr("");
    setSent(true);
  };

  if (sent) {
    return (
      <div
        style={{
          border: "1px solid hsl(38 30% 70%)",
          padding: "2.4rem",
          display: "flex",
          flexDirection: "column",
          gap: ".9rem",
        }}
      >
        <span
          style={{
            display: "inline-block",
            height: 1,
            width: 48,
            background: "hsl(38 38% 48%)",
          }}
        />
        <h3
          style={{
            margin: 0,
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: "2rem",
            lineHeight: 1.1,
            color: "hsl(220 9% 18%)",
          }}
        >
          Your letter is on its way.
        </h3>
        <p
          style={{
            margin: 0,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.2rem",
            lineHeight: 1.55,
            color: "hsl(220 6% 38%)",
            maxWidth: "34ch",
          }}
        >
          Your mail client should have opened with the message ready to send.
          Letters are read and answered personally.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <label htmlFor="cf-name" style={labelStyle}>
          Your name
        </label>
        <input
          id="cf-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErr("");
          }}
          placeholder="Jane Reader"
          className="tlf-field"
          style={fieldStyle}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <label htmlFor="cf-email" style={labelStyle}>
          Your email
        </label>
        <input
          id="cf-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErr("");
          }}
          placeholder="you@email.com"
          className="tlf-field"
          style={fieldStyle}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <label htmlFor="cf-msg" style={labelStyle}>
          Your letter
        </label>
        <textarea
          id="cf-msg"
          rows={4}
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
            setErr("");
          }}
          placeholder="Press, rights, adaptation — or simply a kind word."
          className="tlf-field"
          style={{ ...fieldStyle, resize: "vertical" }}
        />
      </div>
      <div
        style={{
          minHeight: "1.1rem",
          fontFamily: "'Spline Sans Mono', monospace",
          fontSize: ".66rem",
          letterSpacing: ".04em",
          color: "hsl(38 38% 42%)",
        }}
      >
        {err}
      </div>
      <button
        type="submit"
        className="tlf-btn"
        style={{
          alignSelf: "flex-start",
          background: "hsl(220 9% 18%)",
          color: "hsl(42 30% 96%)",
          border: "none",
          borderRadius: 0,
          padding: "1rem 2rem",
          fontFamily: "'Spline Sans Mono', monospace",
          fontSize: ".7rem",
          letterSpacing: ".28em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Send the letter →
      </button>
    </form>
  );
};

export default ContactForm;
