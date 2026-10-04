import { Link } from "react-router-dom";
import "./HeroTypographic.scss";

// ── SETUP NOTE ────────────────────────────────────────────────
// Reads the CSS custom property --navbar-h (published by Navbar)
// to size itself against the viewport. Falls back to 82px.
// ─────────────────────────────────────────────────────────────

// ── Data ──────────────────────────────────────────────────────
// Headline is split into lines so each can be mask-revealed
// independently on load. Keep lines short — they are set at a
// display scale and need to survive narrow viewports.
const HEADLINE = ["Discover", "Art Galleries", "in Lagos"];

const TICKER_ITEMS = [
  { title: "Studio", place: "Yaba" },
  { title: "Exhibition", place: "Ikoyi" },
  { title: "Art Fair", place: "Lekki" },
  { title: "Gallery", place: "Victoria Island" },
  { title: "Museum", place: "Lagos Island" },
  { title: "Workshop", place: "Surulere" },
];

const TICKER_DOUBLED = [...TICKER_ITEMS, ...TICKER_ITEMS];

// ── Icons ─────────────────────────────────────────────────────
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M2 7h10M8 3l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Component ─────────────────────────────────────────────────
export default function HeroTypographic() {
  return (
    <section className="ht" id="home" aria-label="Discover art galleries in Lagos">
      {/* ══════════════════════════════════════════════════════
          ZONE 1 — MONUMENTAL TYPE
          Full-bleed. The headline is the layout; everything else
          is subordinate to it.
      ══════════════════════════════════════════════════════ */}
      <div className="ht__inner">
        <p className="ht__eyebrow">
          <span className="ht__eyebrow-rule" aria-hidden="true" />
          01 — Lagos Art District
        </p>

        <h1 className="ht__headline">
          {HEADLINE.map((line, i) => (
            // Each line gets a clipping mask so the text can slide
            // up from beneath its own baseline on load.
            <span className="ht__line" key={line}>
              <span className="ht__line-inner" style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="ht__meta">
          <p className="ht__desc">
            From the landmark institutions of Victoria Island to the raw creative energy of
            Yaba — every gallery, studio and exhibition space, mapped and ready to explore.
          </p>

          <div className="ht__cta">
            <a className="ht__btn ht__btn--solid" href="#map">
              Open Map
            </a>
            <Link className="ht__btn ht__btn--ghost" to="/galleries">
              Browse Galleries <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          ZONE 2 — TICKER
          Fixed height, always on screen.
      ══════════════════════════════════════════════════════ */}
      <div className="ht__ticker" aria-hidden="true">
        <div className="ht__ticker-track">
          {TICKER_DOUBLED.map(({ title, place }, i) => (
            <div key={i} className="ht__ticker-item">
              <strong>{title}</strong>
              <span className="ht__ticker-dot" aria-hidden="true" />
              {place}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
