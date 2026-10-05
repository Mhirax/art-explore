-- Featured images for the homepage gallery carousel (dev convenience).
--
-- WHY THIS EXISTS
-- `prisma/seed.ts` deliberately does not import the `images` column —
-- images are meant to live in S3 and be attached by
-- `npm run sync:s3-images`, which needs real AWS credentials. Without
-- those, every institution has `images = '{}'` and the homepage
-- carousel renders nothing, because it skips venues with no photo.
--
-- This script populates `images` for six well-known venues so the
-- carousel can be seen working in local development. All six have a
-- description in the seed data, which the carousel overlay displays.
--
-- Every URL below was checked with curl and returned 200. Note that
-- the SMO Contemporary Art URL in galleries.js is dead (400), so that
-- venue is not included.
--
-- THESE ARE HOTLINKED THIRD-PARTY URLS, not owned assets. They were
-- already committed in the repo (frontend/src/data/galleries.js and the
-- original hero carousel) and are reused here. They may rot or change
-- without notice, and their licensing has not been cleared. Replace
-- them with S3-hosted images before production.
--
-- Run:
--   docker exec -i art-explore-db psql -U artexplore -d artexplore \
--     < scripts/seed-featured-images.sql
--
-- Then clear the 60s response cache so the API serves the new rows:
--   docker exec art-explore-redis redis-cli --scan \
--     --pattern 'cache:institutions*' | xargs -r \
--     docker exec art-explore-redis redis-cli DEL
--
-- Undo:
--   UPDATE "Institution" SET images = '{}';

BEGIN;

UPDATE "Institution" SET images = ARRAY[
  'https://d1rgjmn2wmqeif.cloudfront.net/extra/b/HomePageModule-40923-95830.jpg'
] WHERE name = 'Nike Art Gallery';

UPDATE "Institution" SET images = ARRAY[
  'https://www.guestartistsspace.com/Portals/0/EasyDNNnews/759/img-GAS-lagos-.png'
] WHERE name = 'Guest Artists Space Foundation (GAS)';

UPDATE "Institution" SET images = ARRAY[
  'https://sumellist.com/wp-content/uploads/2023/02/Rele_New_Gallery_Day_1-112.jpg'
] WHERE name = 'Rele Gallery';

UPDATE "Institution" SET images = ARRAY[
  'https://africanartists.org/wp-content/uploads/Installations-Coffi-28-scaled.jpg'
] WHERE name = 'African Artists Foundation';

UPDATE "Institution" SET images = ARRAY[
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/2d/c9/c2/the-national-museum.jpg?w=1200&h=-1&s=1'
] WHERE name = 'National Museum Lagos';

UPDATE "Institution" SET images = ARRAY[
  'https://www.artmajeur.com/medias/standard/s/i/signature-beyond-art-gallery/article/1150264_untitled-12.jpg'
] WHERE name = 'Signature Beyond';

COMMIT;

SELECT name, "subArea", left(images[1], 54) AS image
FROM "Institution"
WHERE cardinality(images) > 0
ORDER BY name;
