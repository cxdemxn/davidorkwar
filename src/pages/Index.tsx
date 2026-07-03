import { FormEvent, useEffect, useRef, useState } from "react";
import ContactForm from "@/components/ContactForm";
import skyline from "@/assets/skyline-band.png";
import bookCover from "@/assets/book-cover.jpeg";
import portraitTux from "@/assets/author-tuxedo.jpeg";
import portraitOff from "@/assets/author-offwhite.jpeg";
import portraitTrad from "@/assets/author-traditional.jpeg";
import portraitShades from "@/assets/author-shades.jpeg";
import portraitShirt from "@/assets/author-shirt.jpeg";

const MONO = "'Spline Sans Mono', monospace";
const SERIF = "'Cormorant Garamond', serif";

const NAV = [
  { id: "book", label: "The Book" },
  { id: "about", label: "About" },
  { id: "gallery", label: "Portraits" },
  { id: "contact", label: "Contact" },
];

const navLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  fontFamily: MONO,
  fontSize: ".7rem",
  letterSpacing: ".28em",
  textTransform: "uppercase",
};

const eyebrowRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  fontFamily: MONO,
  fontSize: ".7rem",
  letterSpacing: ".32em",
  textTransform: "uppercase",
  color: "hsl(220 6% 38%)",
};

const goldRule: React.CSSProperties = {
  display: "inline-block",
  height: 1,
  width: 48,
  background: "hsl(38 38% 48%)",
  marginRight: "1rem",
};

const isValidEmail = (email: string) =>
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());

const Index = () => {
  const navRef = useRef<HTMLElement>(null);
  const skylineRef = useRef<HTMLImageElement>(null);
  const gateInputRef = useRef<HTMLInputElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showGate, setShowGate] = useState(() => {
    try {
      return !localStorage.getItem("tlf_access");
    } catch {
      return true;
    }
  });
  const [gateClosing, setGateClosing] = useState(false);
  const [gateErr, setGateErr] = useState("");
  const [gateBusy, setGateBusy] = useState(false);
  const year = new Date().getFullYear();

  // Lock body scroll while the gate is up.
  useEffect(() => {
    if (showGate && !gateClosing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showGate, gateClosing]);

  // Frosted nav + skyline parallax on scroll.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const n = navRef.current;
      if (n) {
        if (y > 24) {
          n.style.background = "hsl(42 30% 96% / .85)";
          n.style.backdropFilter = "blur(12px)";
          n.style.webkitBackdropFilter = "blur(12px)";
          n.style.borderBottomColor = "hsl(35 12% 82% / .6)";
        } else {
          n.style.background = "transparent";
          n.style.backdropFilter = "none";
          n.style.webkitBackdropFilter = "none";
          n.style.borderBottomColor = "transparent";
        }
      }
      const s = skylineRef.current;
      if (s) s.style.transform = `translateY(${y * 0.12}px)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Scroll reveal. Content is visible by default; enhance with a fade-up.
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) return;

    els.forEach((el) => el.classList.add("tlf-reveal-init"));
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("tlf-reveal-in");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((el) => io.observe(el));

    // Fail-safe: never leave content hidden.
    const failsafe = window.setTimeout(() => {
      els.forEach((el) => el.classList.add("tlf-reveal-in"));
    }, 2000);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  const submitGate = async (e: FormEvent) => {
    e.preventDefault();
    if (gateBusy) return;
    const v = (gateInputRef.current?.value || "").trim();
    if (!isValidEmail(v)) {
      setGateErr("Please enter a valid email address.");
      if (gateInputRef.current)
        gateInputRef.current.style.borderColor = "hsl(38 38% 48%)";
      return;
    }
    setGateErr("");
    setGateBusy(true);

    // Keep a local copy first so a signup is never lost to a flaky network.
    try {
      localStorage.setItem("tlf_access", v);
      const raw = localStorage.getItem("tlf_leads");
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(v)) {
        list.push(v);
        localStorage.setItem("tlf_leads", JSON.stringify(list));
      }
    } catch {
      /* noop */
    }

    // Save the lead to Resend. If it fails we still let the reader in —
    // the localStorage copy above is our fallback record.
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: v }),
      });
    } catch {
      /* offline or endpoint unavailable — proceed anyway */
    }

    setGateBusy(false);
    setGateClosing(true);
    window.setTimeout(() => setShowGate(false), 850);
  };

  return (
    <div
      style={{
        background: "hsl(42 30% 96%)",
        color: "hsl(220 9% 18%)",
        fontFamily: SERIF,
        overflowX: "hidden",
      }}
    >
      {/* ============ NAV ============ */}
      <header
        ref={navRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "transparent",
          borderBottom: "1px solid transparent",
          transition:
            "background .5s ease, border-color .5s ease, backdrop-filter .5s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "1.1rem clamp(24px,5vw,96px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a
            href="#top"
            style={{
              textDecoration: "none",
              fontFamily: SERIF,
              fontSize: "1.18rem",
              letterSpacing: ".04em",
              color: "hsl(220 9% 18%)",
            }}
          >
            David{" "}
            <span style={{ fontStyle: "italic", color: "hsl(38 38% 48%)" }}>
              Orkwar
            </span>
          </a>
          <nav
            className="tlf-nav-desktop"
            style={{ alignItems: "center", gap: "2.2rem" }}
          >
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="tlf-navlink"
                style={navLinkStyle}
              >
                {n.label}
              </a>
            ))}
            <a
              href="#book"
              className="tlf-navbuy"
              style={{
                ...navLinkStyle,
                color: "hsl(38 38% 48%)",
                background: "hsl(42 30% 96%)",
                border: "1px solid hsl(38 30% 70%)",
                padding: ".55rem 1.1rem",
              }}
            >
              Buy →
            </a>
          </nav>
          <button
            className="tlf-nav-menubtn"
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: MONO,
              fontSize: ".7rem",
              letterSpacing: ".28em",
              textTransform: "uppercase",
              color: "hsl(220 9% 18%)",
              padding: ".4rem 0",
            }}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
        {menuOpen && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: "1px solid hsl(35 12% 82% / .6)",
              background: "hsl(42 30% 96%)",
            }}
          >
            {NAV.map((n, i) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  textDecoration: "none",
                  fontFamily: MONO,
                  fontSize: ".74rem",
                  letterSpacing: ".28em",
                  textTransform: "uppercase",
                  color: "hsl(220 9% 18%)",
                  padding: ".9rem clamp(24px,5vw,96px)",
                  borderBottom:
                    i < NAV.length - 1
                      ? "1px solid hsl(35 12% 82% / .5)"
                      : "none",
                }}
              >
                {n.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ============ HERO ============ */}
      <section
        id="top"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "150px clamp(24px,5vw,96px) 120px",
          overflow: "hidden",
          scrollMarginTop: 80,
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "clamp(14px,2vw,30px)",
            border: "1px solid hsl(35 12% 82%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <img
          ref={skylineRef}
          src={skyline}
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "-1%",
            width: "100%",
            opacity: 0.62,
            pointerEvents: "none",
            mixBlendMode: "multiply",
            zIndex: 0,
            willChange: "transform",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "clamp(18px,2.3vw,36px)",
            top: "50%",
            transform: "translateY(-50%) rotate(180deg)",
            writingMode: "vertical-rl",
            fontFamily: MONO,
            fontSize: ".6rem",
            letterSpacing: ".34em",
            textTransform: "uppercase",
            color: "hsl(220 6% 38%)",
            zIndex: 2,
          }}
        >
          Abuja 9.07°N &nbsp;→&nbsp; New York 40.71°N
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1400,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div
            data-reveal
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "clamp(26px,5vh,60px)",
            }}
          >
            <div style={eyebrowRow}>
              <span style={goldRule} />
              Author · Noir Romance
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: ".7rem",
                letterSpacing: ".32em",
                textTransform: "uppercase",
                color: "hsl(220 6% 38%)",
              }}
            >
              No.&nbsp;01 · MMXXVI
            </div>
          </div>

          <h1
            style={{
              margin: 0,
              fontWeight: 400,
              lineHeight: 0.86,
              letterSpacing: "-.01em",
            }}
          >
            <span
              data-reveal
              style={{
                display: "block",
                fontSize: "clamp(3.2rem,12vw,9rem)",
                color: "hsl(220 9% 18%)",
              }}
            >
              David
            </span>
            <span
              data-reveal
              style={{
                display: "block",
                fontSize: "clamp(3.2rem,12vw,9rem)",
                fontStyle: "italic",
                color: "hsl(38 38% 48%)",
                paddingLeft: "clamp(20px,7vw,180px)",
              }}
            >
              “The k!nG”
            </span>
            <span
              data-reveal
              style={{
                display: "block",
                fontSize: "clamp(3.2rem,12vw,9rem)",
                color: "hsl(220 9% 18%)",
              }}
            >
              Orkwar
            </span>
          </h1>

          <div
            style={{
              marginTop: "clamp(40px,6vh,72px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: "clamp(28px,4vw,72px)",
              alignItems: "end",
            }}
          >
            <p
              data-reveal
              style={{
                margin: 0,
                maxWidth: "30ch",
                fontStyle: "italic",
                fontSize: "clamp(1.3rem,2.4vw,1.7rem)",
                lineHeight: 1.4,
                color: "hsl(220 6% 38%)",
              }}
            >
              Noir storytelling at the intersection of logic and the soul.
            </p>
            <div
              data-reveal
              style={{
                borderTop: "1px solid hsl(35 12% 82%)",
                paddingTop: "1.4rem",
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: ".66rem",
                  letterSpacing: ".32em",
                  textTransform: "uppercase",
                  color: "hsl(38 38% 48%)",
                  marginBottom: ".9rem",
                }}
              >
                Out now
              </div>
              <p
                style={{
                  margin: "0 0 1.4rem",
                  fontSize: "1.5rem",
                  lineHeight: 1.35,
                  color: "hsl(220 9% 18%)",
                  maxWidth: "34ch",
                }}
              >
                <span style={{ fontStyle: "italic" }}>The Longest Flight</span>{" "}
                — a high-altitude romance of shadows and fated poetry.
              </p>
              <a
                href="#book"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".7rem",
                  textDecoration: "none",
                  fontFamily: MONO,
                  fontSize: ".7rem",
                  letterSpacing: ".28em",
                  textTransform: "uppercase",
                  color: "hsl(220 9% 18%)",
                }}
              >
                Enter the cabin{" "}
                <span
                  style={{
                    display: "inline-block",
                    height: 1,
                    width: 40,
                    background: "hsl(220 9% 18%)",
                  }}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ THE BOOK ============ */}
      <section
        id="book"
        style={{
          position: "relative",
          background: "hsl(42 30% 96%)",
          borderTop: "1px solid hsl(35 12% 82% / .7)",
          padding: "clamp(72px,12vh,150px) clamp(24px,5vw,96px)",
          scrollMarginTop: 70,
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: "clamp(40px,6vw,90px)",
            alignItems: "start",
          }}
        >
          <div
            data-reveal
            style={{
              position: "relative",
              maxWidth: 420,
              width: "100%",
              justifySelf: "center",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: -14,
                border: "1px solid hsl(38 38% 48% / .45)",
                zIndex: 0,
              }}
            />
            <img
              src={bookCover}
              alt="Cover of The Longest Flight by David Orkwar"
              style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                display: "block",
                boxShadow: "0 30px 60px -30px hsl(220 9% 18% / .45)",
              }}
            />
          </div>

          <div style={{ maxWidth: 680 }}>
            <div data-reveal style={{ ...eyebrowRow, marginBottom: "1.6rem" }}>
              <span style={goldRule} />
              A Novel · Contemporary Romance
            </div>
            <h2
              data-reveal
              style={{
                margin: "0 0 1.8rem",
                fontWeight: 400,
                lineHeight: 0.92,
                letterSpacing: "-.01em",
                fontSize: "clamp(2.6rem,6vw,4.6rem)",
              }}
            >
              The Longest
              <br />
              <span style={{ fontStyle: "italic", color: "hsl(38 38% 48%)" }}>
                Flight
              </span>
            </h2>
            <div
              data-reveal
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
                fontSize: "clamp(1.12rem,1.5vw,1.3rem)",
                lineHeight: 1.6,
                maxWidth: "60ch",
              }}
            >
              <p style={{ margin: 0 }}>
                She is <span style={{ fontStyle: "italic" }}>Jewel</span>, a
                global pop icon. He is{" "}
                <span style={{ fontStyle: "italic" }}>Terdoo</span>, a seclusive
                stranger. Trapped in the pressurized sanctuary of the world’s
                longest flight — twenty-three hours from Sydney to London — the
                rules of reality dissolve.
              </p>
              <p style={{ margin: 0 }}>
                Amidst the ultra-luxury of the A350-1000ULR, their separate
                journeys collide in a high-altitude odyssey of shadows and fated
                poetry. Between a mysterious bartender who shouldn’t exist and
                the visceral beauty of a double sunrise, they find that forty
                thousand feet is the only place they can truly breathe.
              </p>
              <p style={{ margin: 0, color: "hsl(220 6% 38%)" }}>
                In this vacuum of luxury and secrets, they realise the sky wasn’t
                just a transit — it was their destiny.
              </p>
            </div>

            <dl
              data-reveal
              style={{
                margin: "2.6rem 0 0",
                borderTop: "1px solid hsl(35 12% 82% / .7)",
                paddingTop: "1.8rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
                gap: "1.4rem 1rem",
              }}
            >
              {[
                ["Genre", "Contemporary Romance"],
                ["Format", "eBook"],
                ["Price", "USD 7.50"],
                ["Length", "Novel"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt
                    style={{
                      fontFamily: MONO,
                      fontSize: ".62rem",
                      letterSpacing: ".28em",
                      textTransform: "uppercase",
                      color: "hsl(220 6% 38%)",
                      marginBottom: ".5rem",
                    }}
                  >
                    {k}
                  </dt>
                  <dd style={{ margin: 0, fontSize: "1.18rem" }}>{v}</dd>
                </div>
              ))}
            </dl>

            <div
              data-reveal
              style={{
                marginTop: "2.6rem",
                borderTop: "1px solid hsl(35 12% 82% / .7)",
                paddingTop: "1.8rem",
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: ".7rem",
                  letterSpacing: ".32em",
                  textTransform: "uppercase",
                  color: "hsl(220 6% 38%)",
                  marginBottom: ".4rem",
                }}
              >
                Where to read
              </div>
              <a
                href="https://www.amazon.com/dp/B0H66B93H3"
                target="_blank"
                rel="noopener noreferrer"
                className="tlf-store-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  padding: "1.15rem 0",
                  borderBottom: "1px solid hsl(35 12% 82% / .7)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: ".8rem" }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "hsl(38 38% 48%)",
                    }}
                  />
                  <span style={{ fontSize: "1.35rem" }}>
                    Amazon Kindle{" "}
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: ".66rem",
                        letterSpacing: ".1em",
                        color: "hsl(220 6% 38%)",
                      }}
                    >
                      · eBook
                    </span>
                  </span>
                </span>
                <span
                  className="tlf-buy-pill"
                  style={{
                    background: "hsl(220 9% 18%)",
                    color: "hsl(42 30% 96%)",
                    padding: ".7rem 1.3rem",
                    fontFamily: MONO,
                    fontSize: ".66rem",
                    letterSpacing: ".24em",
                    textTransform: "uppercase",
                  }}
                >
                  Buy now →
                </span>
              </a>
              {[
                ["This site · Direct", "· USD 7.50"],
                ["Selar", "· Africa & global"],
              ].map(([title, meta]) => (
                <div
                  key={title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    padding: "1.15rem 0",
                    borderBottom: "1px solid hsl(35 12% 82% / .7)",
                    opacity: 0.62,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: ".8rem",
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        border: "1px solid hsl(220 6% 38%)",
                      }}
                    />
                    <span style={{ fontSize: "1.35rem" }}>
                      {title}{" "}
                      <span
                        style={{
                          fontFamily: MONO,
                          fontSize: ".66rem",
                          letterSpacing: ".1em",
                          color: "hsl(220 6% 38%)",
                        }}
                      >
                        {meta}
                      </span>
                    </span>
                  </span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: ".6rem",
                      letterSpacing: ".22em",
                      textTransform: "uppercase",
                      color: "hsl(38 38% 42%)",
                      border: "1px solid hsl(38 30% 70%)",
                      padding: ".4rem .7rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Avail. 20 Sept
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ PULL QUOTE ============ */}
      <section
        style={{
          borderTop: "1px solid hsl(35 12% 82% / .7)",
          padding: "clamp(72px,13vh,140px) clamp(24px,5vw,96px)",
          textAlign: "center",
        }}
      >
        <div data-reveal style={{ maxWidth: "60rem", margin: "0 auto" }}>
          <span
            style={{
              display: "inline-block",
              height: 1,
              width: 56,
              background: "hsl(38 38% 48%)",
              marginBottom: "2rem",
            }}
          />
          <p
            style={{
              margin: 0,
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-.01em",
              fontSize: "clamp(2rem,5.2vw,3.6rem)",
              color: "hsl(220 9% 18%)",
            }}
          >
            “Forty thousand feet is the only place they can truly breathe.”
          </p>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section
        id="about"
        style={{
          borderTop: "1px solid hsl(35 12% 82% / .7)",
          padding: "clamp(72px,12vh,150px) clamp(24px,5vw,96px)",
          scrollMarginTop: 70,
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: "clamp(40px,6vw,90px)",
            alignItems: "start",
          }}
        >
          <div
            data-reveal
            style={{ maxWidth: 420, width: "100%", justifySelf: "center" }}
          >
            <img
              src={portraitTux}
              alt="Portrait of David Orkwar in a white tuxedo"
              className="tlf-portrait"
              style={{ width: "100%", display: "block" }}
            />
            <div
              style={{
                marginTop: ".9rem",
                fontFamily: MONO,
                fontSize: ".62rem",
                letterSpacing: ".24em",
                textTransform: "uppercase",
                color: "hsl(220 6% 38%)",
              }}
            >
              David Orkwar · Abuja
            </div>
          </div>
          <div style={{ maxWidth: 680 }}>
            <div data-reveal style={{ ...eyebrowRow, marginBottom: "1.6rem" }}>
              <span style={goldRule} />
              About the Author
            </div>
            <h2
              data-reveal
              style={{
                margin: "0 0 1.8rem",
                fontWeight: 400,
                lineHeight: 0.96,
                letterSpacing: "-.01em",
                fontSize: "clamp(2.4rem,5vw,3.8rem)",
              }}
            >
              A voice between
              <br />
              <span style={{ fontStyle: "italic", color: "hsl(38 38% 48%)" }}>
                logic &amp; the soul.
              </span>
            </h2>
            <div
              data-reveal
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
                fontSize: "clamp(1.12rem,1.5vw,1.3rem)",
                lineHeight: 1.6,
                maxWidth: "62ch",
              }}
            >
              <p style={{ margin: 0 }}>
                Based in Abuja, Nigeria — with ambitions that stretch to the
                literary heart of New York City — David “The k!nG” Orkwar is a
                25-year-old multihyphenate author whose voice is a rare synthesis
                of technical precision and theological depth.
              </p>
              <p style={{ margin: 0 }}>
                His foundation is built on a degree in Computer Science —
                highlighted by a gold medal from the Mathematical Association of
                Nigeria — and a Diploma in Theology. This unusual pairing lets
                him bridge the gap between logic and the soul, a trait that
                defines his approach to cathartic, noir-tinted storytelling.
              </p>
              <p style={{ margin: 0 }}>
                A prolific creator, David has authored over a million words of
                fiction anonymously and contributed theological insights to{" "}
                <span style={{ fontStyle: "italic" }}>Healing Hands</span>{" "}
                magazine. Having mastered Shakespeare and the Great Classics by
                twelve, his style is now shaped by Dan Brown, James Hadley Chase
                and the emotional resonance of Judith McNaught.
              </p>
              <p style={{ margin: 0, color: "hsl(220 6% 38%)" }}>
                Known for his sharp wit and a penchant for humanising the complex
                — whether through music, gaming or cinema — David is a visionary
                dedicated to narratives with the technical depth of a thriller
                and the soul of a classic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PORTRAITS ============ */}
      <section
        id="gallery"
        style={{
          borderTop: "1px solid hsl(35 12% 82% / .7)",
          padding: "clamp(72px,12vh,140px) clamp(24px,5vw,96px)",
          scrollMarginTop: 70,
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div
            data-reveal
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "2rem",
              marginBottom: "clamp(34px,5vh,72px)",
            }}
          >
            <div>
              <div style={{ ...eyebrowRow, marginBottom: "1.2rem" }}>
                <span style={goldRule} />
                Portraits
              </div>
              <h2
                style={{
                  margin: 0,
                  fontWeight: 400,
                  letterSpacing: "-.01em",
                  fontSize: "clamp(2.2rem,5vw,3.4rem)",
                }}
              >
                In the frame.
              </h2>
            </div>
            <p
              style={{
                margin: 0,
                maxWidth: "22rem",
                textAlign: "right",
                fontFamily: MONO,
                fontSize: ".72rem",
                lineHeight: 1.7,
                letterSpacing: ".02em",
                color: "hsl(220 6% 38%)",
              }}
            >
              A small archive — between the desk, the page, and the rest of the
              world.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: "clamp(14px,1.6vw,26px)",
            }}
          >
            {[
              { src: portraitOff, alt: "David Orkwar portrait", offset: false },
              {
                src: portraitTrad,
                alt: "David Orkwar in traditional attire",
                offset: true,
              },
              {
                src: portraitShades,
                alt: "David Orkwar in sunglasses",
                offset: false,
              },
              {
                src: portraitShirt,
                alt: "David Orkwar in a black shirt",
                offset: true,
              },
            ].map((p) => (
              <figure
                key={p.alt}
                style={{
                  margin: 0,
                  overflow: "hidden",
                  background: "hsl(40 12% 88%)",
                  transform: p.offset ? "translateY(42px)" : undefined,
                }}
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  className="tlf-gallery-img"
                  style={{
                    width: "100%",
                    aspectRatio: "3 / 4",
                    objectFit: "cover",
                    objectPosition: "center top",
                    display: "block",
                  }}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section
        id="contact"
        style={{
          borderTop: "1px solid hsl(35 12% 82% / .7)",
          padding: "clamp(72px,12vh,150px) clamp(24px,5vw,96px)",
          scrollMarginTop: 70,
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: "clamp(44px,6vw,90px)",
            alignItems: "start",
          }}
        >
          <div data-reveal style={{ maxWidth: 520 }}>
            <div style={{ ...eyebrowRow, marginBottom: "1.6rem" }}>
              <span style={goldRule} />
              Correspondence
            </div>
            <h2
              style={{
                margin: "0 0 1.6rem",
                fontWeight: 400,
                lineHeight: 0.94,
                letterSpacing: "-.01em",
                fontSize: "clamp(2.6rem,6vw,4.4rem)",
              }}
            >
              Write to
              <br />
              <span style={{ fontStyle: "italic", color: "hsl(38 38% 48%)" }}>
                the desk.
              </span>
            </h2>
            <p
              style={{
                margin: "0 0 2.4rem",
                fontSize: "1.3rem",
                lineHeight: 1.55,
                color: "hsl(220 6% 38%)",
                maxWidth: "38ch",
              }}
            >
              Press, foreign rights, film &amp; adaptation, or simply a kind word
              from a reader — letters are read and answered personally.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.6rem",
                borderTop: "1px solid hsl(35 12% 82% / .7)",
                paddingTop: "1.8rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: ".62rem",
                    letterSpacing: ".28em",
                    textTransform: "uppercase",
                    color: "hsl(220 6% 38%)",
                    marginBottom: ".5rem",
                  }}
                >
                  Primary
                </div>
                <a
                  href="mailto:orkwardavidt@gmail.com"
                  className="tlf-email-link"
                  style={{
                    textDecoration: "none",
                    fontSize: "1.4rem",
                    color: "hsl(220 9% 18%)",
                  }}
                >
                  orkwardavidt@gmail.com
                </a>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: ".62rem",
                    letterSpacing: ".28em",
                    textTransform: "uppercase",
                    color: "hsl(220 6% 38%)",
                    marginBottom: ".5rem",
                  }}
                >
                  Located
                </div>
                <div
                  style={{
                    fontSize: "1.25rem",
                    color: "hsl(220 9% 18%)",
                    maxWidth: "34ch",
                  }}
                >
                  Abuja, Nigeria — currently. Forwarded to wherever the page
                  takes him.
                </div>
              </div>
            </div>
          </div>
          <div
            data-reveal
            style={{
              maxWidth: 560,
              width: "100%",
              justifySelf: "end",
              border: "1px solid hsl(35 12% 82%)",
              padding: "clamp(24px,3vw,40px)",
              background: "hsl(40 15% 90% / .35)",
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontWeight: 500,
                fontSize: ".72rem",
                letterSpacing: ".32em",
                textTransform: "uppercase",
                color: "hsl(220 9% 18%)",
                marginBottom: "1.6rem",
                display: "flex",
                alignItems: "center",
                gap: ".8rem",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  height: 1,
                  width: 24,
                  background: "hsl(38 38% 48%)",
                }}
              />
              Send a letter
            </div>
            <ContactForm to="orkwardavidt@gmail.com" />
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer
        style={{
          borderTop: "1px solid hsl(35 12% 82% / .7)",
          padding: "2.6rem clamp(24px,5vw,96px)",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: ".66rem",
              letterSpacing: ".1em",
              color: "hsl(220 6% 38%)",
            }}
          >
            © {year} David Orkwar. All rights reserved.
          </div>
          <div
            style={{
              fontStyle: "italic",
              fontSize: "1.1rem",
              color: "hsl(220 6% 38%)",
              textAlign: "center",
            }}
          >
            “The sky wasn’t just a transit — it was their destiny.”
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: ".66rem",
              letterSpacing: ".28em",
              textTransform: "uppercase",
              color: "hsl(220 6% 38%)",
            }}
          >
            DavidOrkwar.com
          </div>
        </div>
      </footer>

      {/* ============ EMAIL GATE ============ */}
      {showGate && (
        <div
          data-gate
          data-closed={gateClosing ? "1" : "0"}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "hsl(42 30% 96%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(24px,5vw,80px)",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "clamp(14px,2vw,30px)",
              border: "1px solid hsl(35 12% 82%)",
              pointerEvents: "none",
            }}
          />
          <img
            src={skyline}
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "4%",
              width: "100%",
              opacity: 0.28,
              pointerEvents: "none",
              mixBlendMode: "multiply",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: 560,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: ".66rem",
                letterSpacing: ".34em",
                textTransform: "uppercase",
                color: "hsl(220 6% 38%)",
                marginBottom: "1.6rem",
              }}
            >
              David “The k!nG” Orkwar
            </div>
            <h2
              style={{
                margin: "0 0 1rem",
                fontWeight: 400,
                lineHeight: 0.92,
                letterSpacing: "-.01em",
                fontSize: "clamp(2.8rem,9vw,5rem)",
              }}
            >
              The Longest
              <br />
              <span style={{ fontStyle: "italic", color: "hsl(38 38% 48%)" }}>
                Flight
              </span>
            </h2>
            <p
              style={{
                margin: "0 auto 2.4rem",
                maxWidth: "34ch",
                fontStyle: "italic",
                fontSize: "1.3rem",
                lineHeight: 1.45,
                color: "hsl(220 6% 38%)",
              }}
            >
              A high-altitude noir romance. Enter your email to step aboard.
            </p>
            <form
              onSubmit={submitGate}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: ".8rem",
                justifyContent: "center",
                maxWidth: 480,
                margin: "0 auto",
              }}
            >
              <input
                ref={gateInputRef}
                type="email"
                required
                placeholder="you@email.com"
                aria-label="Email address"
                className="tlf-field"
                style={{
                  flex: "1 1 240px",
                  minWidth: 0,
                  background: "transparent",
                  border: "1px solid hsl(35 12% 82%)",
                  borderRadius: 0,
                  padding: "1rem 1.1rem",
                  fontFamily: SERIF,
                  fontSize: "1.25rem",
                  color: "hsl(220 9% 18%)",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                className="tlf-btn"
                disabled={gateBusy}
                style={{
                  flex: "0 0 auto",
                  background: "hsl(220 9% 18%)",
                  color: "hsl(42 30% 96%)",
                  border: "none",
                  borderRadius: 0,
                  padding: "1rem 1.8rem",
                  fontFamily: MONO,
                  fontSize: ".7rem",
                  letterSpacing: ".26em",
                  textTransform: "uppercase",
                  cursor: gateBusy ? "default" : "pointer",
                  opacity: gateBusy ? 0.6 : 1,
                }}
              >
                {gateBusy ? "Entering…" : "Enter →"}
              </button>
            </form>
            <div
              style={{
                minHeight: "1.1rem",
                marginTop: ".9rem",
                fontFamily: MONO,
                fontSize: ".66rem",
                letterSpacing: ".04em",
                color: "hsl(38 38% 42%)",
              }}
            >
              {gateErr}
            </div>
            <div
              style={{
                marginTop: "1.4rem",
                fontFamily: MONO,
                fontSize: ".6rem",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "hsl(220 6% 38%)",
                opacity: 0.8,
              }}
            >
              We’ll only write to you about the book. No noise.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
