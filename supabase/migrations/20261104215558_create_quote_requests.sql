/*
# Create quote_requests table (public contact / quote form)

1. New Tables
- `quote_requests`
  - `id` (uuid, primary key)
  - `client_type` (text): 'particulier' or 'professionnel'
  - `full_name` (text, required)
  - `email` (text, required)
  - `phone` (text, required)
  - `city` (text, required): town within the Eurometropole de Strasbourg
  - `services` (text[], required): selected cleaning services
  - `surface_m2` (integer, optional)
  - `preferred_date` (date, optional)
  - `message` (text, optional)
  - `created_at` (timestamptz, default now())

2. Security
- Row level security enabled on `quote_requests`.
- The public website (anon role) and signed-in users can only INSERT rows, with length and format checks.
- No SELECT, UPDATE or DELETE grant or policy: visitors cannot read other requests. The business owner reads them from the Supabase dashboard.

3. Important notes
- The site has no sign-in screen, so the anon role is the one that submits the form.
- CHECK constraints keep stored values within expected bounds even if the form is bypassed.
*/

CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_type text NOT NULL CHECK (client_type IN ('particulier', 'professionnel')),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 200 AND email LIKE '%_@_%.__%'),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 6 AND 30),
  city text NOT NULL CHECK (char_length(city) BETWEEN 2 AND 120),
  services text[] NOT NULL CHECK (cardinality(services) BETWEEN 1 AND 10),
  surface_m2 integer CHECK (surface_m2 IS NULL OR surface_m2 BETWEEN 1 AND 100000),
  preferred_date date,
  message text CHECK (message IS NULL OR char_length(message) <= 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON quote_requests TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_quote_requests" ON quote_requests;
CREATE POLICY "anon_insert_quote_requests" ON quote_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);
