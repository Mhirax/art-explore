import { useCallback, useEffect, useState } from 'react';
import { apiGet } from '../lib/api';

/**
 * Highest-rated venues, each paired with its most recent approved
 * review, for the "Popular Reviews" section.
 *
 * There is no public cross-venue reviews endpoint — reviews are only
 * readable per institution (`GET /institutions/:id/reviews`). So this
 * asks for the top-rated venues in one call, then fetches reviews for
 * just those few. `limit` is kept small deliberately: each venue costs
 * one extra request.
 *
 * Venues with no approved review are dropped rather than rendered with
 * an empty quote.
 */
export function usePopularReviews({ limit = 4 } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // `sort=rating` puts nulls last, so unreviewed venues never
      // outrank reviewed ones.
      const { data: venues } = await apiGet('/institutions', {
        limit,
        sort: 'rating',
      });

      const withReviews = await Promise.all(
        (venues ?? []).map(async (venue) => {
          try {
            const { data: reviews } = await apiGet(
              `/institutions/${venue.id}/reviews`,
              { limit: 1 },
            );
            return { venue, review: reviews?.[0] ?? null };
          } catch {
            // One venue's reviews failing shouldn't blank the section.
            return { venue, review: null };
          }
        }),
      );

      setItems(withReviews.filter((r) => r.review));
    } catch (err) {
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, error, reload: load };
}
