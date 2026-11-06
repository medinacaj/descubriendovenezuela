-- Idempotent additions for content records managed from the versioned catalog.
ALTER TABLE places ADD COLUMN IF NOT EXISTS catalog_id text;
ALTER TABLE places ADD COLUMN IF NOT EXISTS verification_note text NOT NULL DEFAULT '';
CREATE UNIQUE INDEX IF NOT EXISTS places_catalog_id_unique ON places(catalog_id);
