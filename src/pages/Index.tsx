import { useEffect, useState } from "react";
import bookCover from "@/assets/book-cover-longest-flight.jpeg";
import portraitTux from "@/assets/author-tuxedo.jpeg";
import portraitOff from "@/assets/author-offwhite.jpeg";
import portraitTrad from "@/assets/author-traditional.jpeg";
import portraitShades from "@/assets/author-shades.jpeg";
import portraitShirt from "@/assets/author-shirt.jpeg";
import skyline from "@/assets/sydney-skyline.jpeg";

const NAV = [
  { id: "book", label: "The Book" },
  { id: "about", label: "About" },
  { id: "gallery", label: "Portraits" },
  { id: "contact", label: "Contact" },
];

const Index = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* ── NAV ─────────────────────────────────────────── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? "bg-background/85 backdrop-blur-md border-b border-border/60" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-12">
          <a href="#top" className="font-serif-d text-lg tracking-wide">
            David <span className="text-gold italic">Orkwar</span>
          </a>
          <nav className="hidden items-center gap-10 md:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <button
            aria-label="Menu"
            onClick={() => setOpen(!open)}
            className="md:hidden text-[0.72rem] uppercase tracking-[0.28em]"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t border-border/60 bg-background">
            <nav className="flex flex-col px-6 py-4">
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className="py-3 text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground"
                >
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────── */}
      <section id="top" className="relative pt-40 pb-24 md:pt-56 md:pb-40">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-6 px-6 md:px-12">
          <div className="col-span-12 md:col-span-7">
            <p className="eyebrow mb-8">
              <span className="rule-gold mr-4" />
              Author · Abuja → New York
            </p>
            <h1 className="display text-[3.4rem] sm:text-[5rem] md:text-[7rem] lg:text-[8.5rem]">
              David
              <br />
              <span className="italic text-gold">“The k!nG”</span>
              <br />
              Orkwar
            </h1>
            <p className="mt-10 max-w-md font-serif-d text-xl italic text-muted-foreground md:text-2xl">
              Noir storytelling at the intersection of logic and the soul.
            </p>
          </div>

          <div className="col-span-12 mt-12 flex flex-col justify-end md:col-span-5 md:mt-0">
            <div className="border-t border-border/70 pt-6">
              <p className="eyebrow mb-3">Out now</p>
              <p className="font-serif-d text-2xl leading-snug">
                <em>The Longest Flight</em> — a high-altitude romance of shadows
                and fated poetry.
              </p>
              <a
                href="#book"
                className="mt-6 inline-flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.28em] text-foreground"
              >
                <span>Read the first chapter</span>
                <span className="h-px w-10 bg-foreground transition-all group-hover:w-16" />
              </a>
            </div>
          </div>
        </div>

        {/* faint skyline at bottom */}
        <img
          src={skyline}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 mx-auto w-full max-w-[1400px] px-6 opacity-[0.18] md:px-12"
        />
      </section>

      {/* ── BOOK ────────────────────────────────────────── */}
      <section id="book" className="border-t border-border/70 bg-background py-24 md:py-36">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-10 px-6 md:px-12">
          <div className="col-span-12 md:col-span-5">
            <div className="relative">
              <div className="absolute -inset-3 -z-10 border border-gold/40" />
              <img
                src={bookCover}
                alt="The Longest Flight — book cover by David Orkwar"
                className="w-full max-w-md shadow-[0_30px_60px_-30px_hsl(var(--foreground)/0.35)]"
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 md:pl-8">
            <p className="eyebrow mb-6">
              <span className="rule-gold mr-4" />
              A Novel · Contemporary Romance
            </p>
            <h2 className="display text-5xl md:text-7xl">
              The Longest <em className="italic text-gold">Flight</em>
            </h2>

            <div className="prose-serif mt-10 max-w-2xl space-y-5 text-lg md:text-xl">
              <p>
                She is <em>Jewel</em>, a global pop icon who represents beauty
                and perfection to the rest of the world. He is{" "}
                <em>Terdoo</em>, a seclusive stranger hiding behind a wall of
                silence. Trapped in the pressurized sanctuary of the world’s
                longest flight — twenty-three hours from Sydney to London — the
                rules of reality dissolve.
              </p>
              <p>
                Amidst the ultra-luxury of the A350-1000ULR, their separate
                journeys collide in a high-altitude odyssey of shadows and
                fated poetry. Between a mysterious bartender who shouldn’t
                exist and the visceral beauty of a double sunrise, they find
                that forty thousand feet is the only place they can truly
                breathe.
              </p>
              <p className="text-muted-foreground">
                In this vacuum of luxury and secrets, they realise the sky
                wasn’t just a transit — it was their destiny.
              </p>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border/70 pt-8 sm:grid-cols-4">
              {[
                ["Genre", "Contemporary Romance"],
                ["Format", "eBook"],
                ["Price", "USD 7.50"],
                ["Length", "Novel"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow mb-2">{k}</dt>
                  <dd className="font-serif-d text-lg">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="mailto:orkwardavidt@gmail.com?subject=The%20Longest%20Flight%20%E2%80%94%20Order"
                className="group inline-flex items-center gap-3 bg-foreground px-7 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-background transition-colors hover:bg-gold"
              >
                Purchase the eBook
                <span aria-hidden>→</span>
              </a>
              <a
                href="/the-longest-flight-sample.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 border border-foreground/80 px-7 py-4 text-[0.72rem] uppercase tracking-[0.28em] transition-colors hover:border-gold hover:text-gold"
              >
                Download sample
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ──────────────────────────────────── */}
      <section className="border-t border-border/70 py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
          <span className="rule-gold mb-8 block mx-auto" />
          <p className="display text-3xl italic md:text-5xl">
            “Forty thousand feet is the only place
            <br />
            they can truly breathe.”
          </p>
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────────────────── */}
      <section id="about" className="border-t border-border/70 py-24 md:py-36">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-10 px-6 md:px-12">
          <div className="col-span-12 md:col-span-5">
            <img
              src={portraitTux}
              alt="Portrait of David Orkwar"
              className="w-full max-w-md object-cover grayscale"
            />
          </div>

          <div className="col-span-12 md:col-span-7 md:pl-8">
            <p className="eyebrow mb-6">
              <span className="rule-gold mr-4" />
              About the Author
            </p>
            <h2 className="display text-5xl md:text-6xl">
              A voice between
              <br />
              <em className="italic text-gold">logic & the soul.</em>
            </h2>

            <div className="prose-serif mt-10 max-w-2xl space-y-5 text-lg md:text-xl">
              <p>
                Based in Abuja, Nigeria — with ambitions that stretch to the
                literary heart of New York City — David <em>“The k!nG”</em>{" "}
                Orkwar is a 25-year-old multihyphenate author whose voice is a
                rare synthesis of technical precision and theological depth.
              </p>
              <p>
                His foundation is built on a degree in Computer Science —
                highlighted by a gold medal from the Mathematical Association
                of Nigeria — and a Diploma in Theology. This unusual pairing
                lets him bridge the gap between logic and the soul, a trait
                that defines his approach to cathartic, noir-tinted
                storytelling.
              </p>
              <p>
                A prolific creator, David has authored over a million words of
                fiction anonymously and contributed theological insights to{" "}
                <em>Healing Hands</em> magazine. Having mastered Shakespeare
                and the Great Classics by twelve, his style is now shaped by
                Dan Brown, James Hadley Chase and the emotional resonance of
                Judith McNaught.
              </p>
              <p className="text-muted-foreground">
                Known for his sharp wit and a penchant for humanising the
                complex — whether through music, gaming or cinema — David is a
                visionary dedicated to narratives with the technical depth of a
                thriller and the soul of a classic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────────────────── */}
      <section id="gallery" className="border-t border-border/70 py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-4">
                <span className="rule-gold mr-4" />
                Portraits
              </p>
              <h2 className="display text-4xl md:text-5xl">In the frame.</h2>
            </div>
            <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
              A small archive — between the desk, the page, and the rest of the
              world.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[portraitOff, portraitTrad, portraitShades, portraitShirt].map(
              (src, i) => (
                <div
                  key={i}
                  className={`overflow-hidden bg-muted ${
                    i % 2 ? "md:translate-y-10" : ""
                  }`}
                >
                  <img
                    src={src}
                    alt={`David Orkwar portrait ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────── */}
      <section id="contact" className="border-t border-border/70 py-24 md:py-36">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-10 px-6 md:px-12">
          <div className="col-span-12 md:col-span-6">
            <p className="eyebrow mb-6">
              <span className="rule-gold mr-4" />
              Correspondence
            </p>
            <h2 className="display text-5xl md:text-7xl">
              Write to <em className="italic text-gold">the desk.</em>
            </h2>
            <p className="prose-serif mt-8 max-w-md text-lg text-muted-foreground">
              Press, foreign rights, film & adaptation, or simply a kind word
              from a reader — letters are read and answered personally.
            </p>
          </div>

          <div className="col-span-12 md:col-span-6 md:pl-8">
            <ul className="space-y-8 border-t border-border/70 pt-8">
              <li>
                <p className="eyebrow mb-2">Primary</p>
                <a
                  href="mailto:orkwardavidt@gmail.com"
                  className="font-serif-d text-2xl underline-offset-8 hover:text-gold hover:underline md:text-3xl"
                >
                  orkwardavidt@gmail.com
                </a>
              </li>
              <li>
                <p className="eyebrow mb-2">Secondary</p>
                <a
                  href="mailto:royaltyyy007@gmail.com"
                  className="font-serif-d text-2xl underline-offset-8 hover:text-gold hover:underline md:text-3xl"
                >
                  royaltyyy007@gmail.com
                </a>
              </li>
              <li>
                <p className="eyebrow mb-2">Located</p>
                <p className="font-serif-d text-xl">
                  Abuja, Nigeria — currently. Forwarded to wherever the page
                  takes him.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="border-t border-border/70 py-10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 px-6 text-xs text-muted-foreground md:flex-row md:items-center md:px-12">
          <p>
            © {new Date().getFullYear()} David Orkwar. All rights reserved.
          </p>
          <p className="font-serif-d italic">
            “The sky wasn’t just a transit — it was their destiny.”
          </p>
          <p className="uppercase tracking-[0.28em]">DavidOrkwar.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
