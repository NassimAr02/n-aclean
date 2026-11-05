/*
# Add particulier and professional fields to quote_requests

1. Modified Table: `quote_requests`
- `company_name` (text, optional): company name, required for professional requests.
- `siret` (text, optional): 14-digit company registration number.
- `property_type` (text, optional): kind of place to clean. Values depend on the client type (home types for particuliers, premises types for professionals).
- `frequency` (text, optional): how often a professional needs the service (one-off or recurring).

2. Constraints
- A professional request must include a company name.
- Allowed values are enforced for `property_type` and `frequency`.
- SIRET must be exactly 14 digits when provided.

3. Security
- No change to row level security or grants. Public visitors can still only insert requests.

4. Important notes
- All new columns are optional, so existing rows (none at the time of this change) remain valid.
*/

ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS company_name text CHECK (company_name IS NULL OR char_length(company_name) BETWEEN 2 AND 160);
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS siret text CHECK (siret IS NULL OR siret ~ '^[0-9]{14}$');
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS property_type text CHECK (property_type IS NULL OR property_type IN ('appartement', 'maison', 'bureaux', 'commerce', 'espaces_communs', 'locaux_activite', 'autre'));
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS frequency text CHECK (frequency IS NULL OR frequency IN ('ponctuelle', 'hebdomadaire', 'bihebdomadaire', 'quotidienne', 'mensuelle', 'a_definir'));

ALTER TABLE quote_requests DROP CONSTRAINT IF EXISTS quote_requests_company_required_for_pro;
ALTER TABLE quote_requests ADD CONSTRAINT quote_requests_company_required_for_pro CHECK (client_type <> 'professionnel' OR company_name IS NOT NULL);
