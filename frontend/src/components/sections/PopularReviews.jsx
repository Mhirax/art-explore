import GalleryCarousel from "./GalleryCarousel.jsx";
import { usePopularReviews } from "../../hooks/usePopularReviews";
import "./PopularReviews.scss";

/**
 * "Popular Reviews" — what visitors said about the best-rated venues.
 *
 * Reads real approved reviews from the API. If no review has been
 * approved yet the section states that plainly instead of rendering
 * placeholder quotes, because invented reviews on a directory people
 * use to decide where to spend an afternoon would be worse than an
 * honest empty state.
 */

// Five glyphs, filled to the rounded rating.
function Stars({ rating }) {
  const filled = Math.round(rating ?? 0);
  return (
    <span className="pr__stars" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`pr__star${i < filled ? " pr__star--on" : ""}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );
}

const AREA_LABEL = { ISLAND: "Island", MAINLAND: "Mainland", OTHER: "Lagos" };

export default function PopularReviews() {
  const { items, loading, error } = usePopularReviews({ limit: 4 });

  return (
    <section className="pr" id="reviews" aria-label="Popular reviews">
      <header className="pr__head">
        <p className="pr__eyebrow">
          <span className="pr__eyebrow-rule" aria-hidden="true" />
          03 — From visitors
        </p>
        <h2 className="pr__title">Popular Galleries Review</h2>
        <p className="pr__lede">
          What people actually thought after turning up — the rooms worth the
          traffic, in their words.
        </p>
      </header>

      <GalleryCarousel />

      {loading ? (
        <p className="pr__state">Gathering reviews…</p>
      ) : error ? (
        <p className="pr__state">Couldn’t load reviews — {error}</p>
      ) : items.length === 0 ? (
        // Honest empty state. Nothing is invented to fill the grid.
        <div className="pr__empty">
          <p className="pr__empty-head">No reviews published yet.</p>
          <p className="pr__empty-sub">
            Reviews appear here once a visitor leaves one and a moderator
            approves it. Be the first.
          </p>
          <a className="pr__empty-cta" href="/signup">
            Write a review
          </a>
        </div>
      ) : (
        <ul className="pr__grid">
          {items.map(({ venue, review }) => (
            <li className="pr__card" key={review.id}>
              <blockquote className="pr__quote">
                <Stars rating={review.rating} />
                {review.comment ? (
                  <p className="pr__comment">{review.comment}</p>
                ) : (
                  // A rating with no words is still a valid review.
                  <p className="pr__comment pr__comment--bare">
                    Rated {review.rating} out of 5, no comment left.
                  </p>
                )}
              </blockquote>

              <footer className="pr__by">
                <span className="pr__venue">{venue.name}</span>
                <span className="pr__where">
                  {venue.subArea || AREA_LABEL[venue.area] || "Lagos"}
                  {venue.reviewCount > 1 && (
                    <> · {venue.reviewCount} reviews</>
                  )}
                </span>
              </footer>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
