-- Importación idempotente del catálogo documental de content/places.json.
-- No modifica publicaciones editoriales existentes.
ALTER TABLE places ADD COLUMN IF NOT EXISTS catalog_id text;
ALTER TABLE places ADD COLUMN IF NOT EXISTS verification_note text;
ALTER TABLE places ADD COLUMN IF NOT EXISTS media_credits jsonb NOT NULL DEFAULT '[]'::jsonb;
CREATE UNIQUE INDEX IF NOT EXISTS places_catalog_id_unique ON places(catalog_id) WHERE catalog_id IS NOT NULL;
