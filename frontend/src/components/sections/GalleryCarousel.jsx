import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGalleries } from "../../hooks/useGalleries";
import "./GalleryCarousel.scss";

/**
 * Image slider for the notable venues that actually have a photo.
 *
 * Sourced from the live institution list rather than a hardcoded
 * array: it shows whichever venues have a populated `images` column,
 * so it fills out on its own as more are uploaded. Venues without an
 * image are skipped entirely — no placeholder slides.
 *
 * `PREFERRED` only controls running order, putting the best-known
 * names first; it never adds a venue that isn't in the data.
 */
const PREFERRED = [
  "Nike Art Gallery",
  "Guest Artists Space Foundation (GAS)",
  "Rele Gallery",
  "African Artists Foundation",
  "National Museum Lagos",
  "Signature Beyond",
];

const MAX_SLIDES = 6;
const AUTOPLAY_MS = 5000;

const TYPE_LABEL = {
  ART_GALLERY: "Gallery",
  MUSEUM: "Museum",
  HUB_INSTITUTION: "Cultural space",
  FOUNDATION: "Foundation",
  INSTITUTE: "Institute",
  STUDIO: "Studio",
  CULTURAL_SPACE: "Cultural space",
  NOMADIC_SPACE: "Nomadic space",
  ART_FESTIVAL: "Festival",
};

const Arrow = ({ dir }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d={dir === "prev" ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function GalleryCarousel() {
  const { galleries, loading } = useGalleries();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = useMemo(() => {
    const withImage = galleries.filter((g) => g.image);
    const rank = (g) => {
      const i = PREFERRED.indexOf(g.name);
      return i === -1 ? PREFERRED.length : i;
    };
    return [...withImage].sort((a, b) => rank(a) - rank(b)).slice(0, MAX_SLIDES);
  }, [galleries]);

  const count = slides.length;

  const go = useCallback(
    (next) => {
      if (count === 0) return;
      // Wrap in both directions.
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  // Autoplay. Pauses on hover/focus, and never runs for a single
  // slide or when the visitor prefers reduced motion.
  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => go(indexRef.current + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count, paused, go]);

  // An index can outlive the data it pointed into (a shorter list on
  // reload), which would otherwise leave the track scrolled past the end.
  useEffect(() => {
    if (index > count - 1) setIndex(0);
  }, [count, index]);

  if (loading || count === 0) return null;

  const current = slides[index];

  return (
    <div
      className="gc"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Notable galleries"
    >
      <div className="gc__viewport">
        <div
          className="gc__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((g, i) => (
            <figure
              className="gc__slide"
              key={g.id}
              aria-hidden={i !== index}
              aria-label={`${i + 1} of ${count}`}
            >
              <img
                className="gc__img"
                src={g.image}
                alt={g.name}
                // Only the first slide is worth blocking render for.
                loading={i === 0 ? "eager" : "lazy"}
                onError={(e) => {
                  // These are third-party URLs; a dead one should fade
                  // the frame rather than show a broken-image icon.
                  e.currentTarget.style.visibility = "hidden";
                }}
              />
            </figure>
          ))}
        </div>

        {/* Overlay sits outside the track so it doesn't slide with
            it, and is keyed on the index so its contents re-animate
            on each change. */}
        <div className="gc__overlay" key={current.id}>
          <p className="gc__kicker">
            {TYPE_LABEL[current.type] ?? "Space"}
            {current.subArea ? ` · ${current.subArea}` : ""}
          </p>
          <h3 className="gc__name">{current.name}</h3>
          {current.description && (
            <p className="gc__desc">{current.description}</p>
          )}
          <Link className="gc__link" to="/galleries">
            See it in the directory <Arrow dir="next" />
          </Link>
        </div>
      </div>

      <div className="gc__controls">
        <button
          className="gc__arrow"
          onClick={() => go(index - 1)}
          aria-label="Previous gallery"
        >
          <Arrow dir="prev" />
        </button>

        <div className="gc__dots" role="tablist" aria-label="Choose a gallery">
          {slides.map((g, i) => (
            <button
              key={g.id}
              role="tab"
              aria-selected={i === index}
              aria-label={g.name}
              className={`gc__dot${i === index ? " gc__dot--on" : ""}`}
              onClick={() => go(i)}
            />
          ))}
        </div>

        <button
          className="gc__arrow"
          onClick={() => go(index + 1)}
          aria-label="Next gallery"
        >
          <Arrow dir="next" />
        </button>
      </div>
    </div>
  );
}
