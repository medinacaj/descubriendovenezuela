-- Datos comerciales opcionales; contacto público solamente con autorización.
ALTER TABLE places ADD COLUMN IF NOT EXISTS street_address text NOT NULL DEFAULT '';
ALTER TABLE places ADD COLUMN IF NOT EXISTS contact_phone text NOT NULL DEFAULT '';
ALTER TABLE places ADD COLUMN IF NOT EXISTS whatsapp_phone text NOT NULL DEFAULT '';
ALTER TABLE places ADD COLUMN IF NOT EXISTS website text NOT NULL DEFAULT '';
ALTER TABLE places ADD COLUMN IF NOT EXISTS opening_hours_note text NOT NULL DEFAULT '';
ALTER TABLE places ADD COLUMN IF NOT EXISTS contact_authorized boolean NOT NULL DEFAULT false;
ALTER TABLE places ADD COLUMN IF NOT EXISTS contact_evidence text NOT NULL DEFAULT '';
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='places_contact_authorization') THEN
    ALTER TABLE places ADD CONSTRAINT places_contact_authorization
      CHECK (NOT contact_authorized OR length(trim(contact_evidence)) >= 10);
  END IF;
END;
$$;
