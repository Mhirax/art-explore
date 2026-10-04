import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useGalleries } from "../../hooks/useGalleries";
import "./SpaceTypes.scss";

/**
 * "What kind of space" — the nine InstitutionType values, named in
 * plain language and counted from live data.
 *
 * A visitor who has never been to a Lagos gallery does not know the
 * difference between a hub, a foundation and a nomadic space. This
 * section exists to tell them, because the distinction changes how
 * you turn up: whether you can walk in, whether you need an
 * appointment, whether there is anything on the walls at all.
 *
 * Types with no entries in the database are not rendered.
 */

// Keyed to prisma/schema.prisma → enum InstitutionType.
// Order is editorial: most walk-in-able first.
const TYPES = [
  {
    key: "ART_GALLERY",
    label: "Galleries",
    note: "Commercial rooms showing work for sale. Walk in, look, leave. No ticket.",
  },
  {
    key: "MUSEUM",
    label: "Museums",
    note: "Permanent collections and the national archive. Fixed hours, usually a fee.",
  },
  {
    key: "HUB_INSTITUTION",
    label: "Hubs & cultural spaces",
    note: "Mixed programmes — talks, screenings, residencies. Check what is on before you go.",
  },
  {
    key: "FOUNDATION",
    label: "Foundations",
    note: "Privately funded, programme-led. Often by appointment rather than open daily.",
  },
  {
    key: "INSTITUTE",
    label: "Institutes",
    note: "Teaching and research spaces that also exhibit. Term-time rhythms.",
  },
  {
    key: "STUDIO",
    label: "Studios",
    note: "Where the work is made. Visits are arranged, not assumed.",
  },
  {
    key: "CULTURAL_SPACE",
    label: "Cultural spaces",
    note: "Performance, music and craft alongside visual art. Evening-heavy.",
  },
  {
    key: "NOMADIC_SPACE",
    label: "Nomadic spaces",
    note: "No fixed address. They appear for a show, then move on.",
  },
  {
    key: "ART_FESTIVAL",
    label: "Festivals",
    note: "Dated, city-wide, temporary. Worth planning a trip around.",
  },
];

export default function SpaceTypes() {
  const { galleries, loading, error } = useGalleries();

  const rows = useMemo(() => {
    const counts = new Map();
    for (const g of galleries) {
      counts.set(g.type, (counts.get(g.type) ?? 0) + 1);
    }
    // Only show what actually exists in the data.
    return TYPES.map((t) => ({ ...t, count: counts.get(t.key) ?? 0 })).filter(
      (t) => t.count > 0
    );
  }, [galleries]);

  if (loading) {
    return (
      <section className="st" id="types">
        <p className="st__state">Counting spaces…</p>
      </section>
    );
  }
  if (error) {
    return (
      <section className="st" id="types">
        <p className="st__state">Couldn’t load space types — {error}</p>
      </section>
    );
  }

  const total = rows.reduce((sum, r) => sum + r.count, 0);

  return (
    <section className="st" id="types" aria-label="Browse by kind of space">
      <header className="st__head">
        <p className="st__eyebrow">
          <span className="st__eyebrow-rule" aria-hidden="true" />
          02 — What kind of space
        </p>
        <h2 className="st__title">Not everything with art on the wall is a gallery.</h2>
        <p className="st__lede">
          {total} spaces, sorted by what they actually are — because it changes whether
          you can simply walk in.
        </p>
      </header>

      <ol className="st__grid">
        {rows.map(({ key, label, note, count }, i) => (
          <li className="st__cell" key={key}>
            <Link className="st__link" to="/galleries">
              {/* Index numeral, set large and low-contrast — it
                  gives the grid its rhythm without competing. */}
              <span className="st__index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="st__count">{count}</span>
              <h3 className="st__label">{label}</h3>
              <p className="st__note">{note}</p>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
