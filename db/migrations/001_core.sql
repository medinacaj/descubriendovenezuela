CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TABLE IF NOT EXISTS territories (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text NOT NULL, kind text NOT NULL CHECK(kind IN ('country','region','municipality','parish','locality')), parent_id integer REFERENCES territories(id), source text, UNIQUE(name,parent_id));
CREATE OR REPLACE FUNCTION validate_territory_parent() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE pk text;
BEGIN
 IF NEW.parent_id IS NULL THEN IF NEW.kind <> 'country' THEN RAISE EXCEPTION 'Parent required'; END IF; RETURN NEW; END IF;
 SELECT kind INTO pk FROM territories WHERE id=NEW.parent_id;
 IF NOT ((NEW.kind='region' AND pk='country') OR (NEW.kind='municipality' AND pk='region') OR (NEW.kind='parish' AND pk='municipality') OR (NEW.kind='locality' AND pk='parish')) THEN RAISE EXCEPTION 'Invalid territory hierarchy'; END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS territory_parent ON territories;
CREATE TRIGGER territory_parent BEFORE INSERT OR UPDATE ON territories FOR EACH ROW EXECUTE FUNCTION validate_territory_parent();
CREATE TABLE IF NOT EXISTS places (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, category text NOT NULL, territory_id integer NOT NULL REFERENCES territories(id), description text NOT NULL, source text NOT NULL DEFAULT '', reviewed_at date, status text NOT NULL CHECK(status IN ('proposed','verified','outdated','closed')), published boolean NOT NULL DEFAULT false, sensitive boolean NOT NULL DEFAULT false, location geometry(Point,4326), demo boolean NOT NULL DEFAULT false, updated_at timestamptz NOT NULL DEFAULT now(), CHECK(NOT published OR (source LIKE 'https://%' AND reviewed_at IS NOT NULL AND status='verified')));
CREATE INDEX IF NOT EXISTS places_location ON places USING gist(location);
CREATE TABLE IF NOT EXISTS admin_users(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),email text UNIQUE NOT NULL,password_hash text NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(token_hash text PRIMARY KEY,user_id uuid NOT NULL REFERENCES admin_users(id),expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS login_attempts(ip text PRIMARY KEY,attempts integer NOT NULL DEFAULT 1,window_start timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS change_log(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,place_id uuid NOT NULL,actor uuid REFERENCES admin_users(id),action text NOT NULL,before_data jsonb,after_data jsonb,created_at timestamptz NOT NULL DEFAULT now());
