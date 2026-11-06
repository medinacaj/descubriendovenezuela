-- Precio opcional con fuente y vencimiento. No inferir conversión de divisas.
ALTER TABLE places ADD COLUMN IF NOT EXISTS price_amount numeric(12,2);
ALTER TABLE places ADD COLUMN IF NOT EXISTS price_currency text NOT NULL DEFAULT '';
ALTER TABLE places ADD COLUMN IF NOT EXISTS price_unit text NOT NULL DEFAULT '';
ALTER TABLE places ADD COLUMN IF NOT EXISTS price_valid_until date;
ALTER TABLE places ADD COLUMN IF NOT EXISTS price_source text NOT NULL DEFAULT '';
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='places_price_evidence') THEN
    ALTER TABLE places ADD CONSTRAINT places_price_evidence CHECK (
      price_amount IS NULL OR (
        price_amount >= 0
        AND price_currency IN ('VES','USD','EUR')
        AND price_unit IN ('persona','noche','entrada','servicio')
        AND price_valid_until IS NOT NULL
        AND price_source LIKE 'https://%'
      )
    );
  END IF;
END;
$$;
