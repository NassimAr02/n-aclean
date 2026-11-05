/*
# Admin access to quote requests

1. New Tables
- `admin_users`
  - `user_id` (uuid, primary key): the signed-in account allowed to open the admin area. References the account in the authentication table and is removed with it.
  - `created_at` (timestamptz): when access was granted.

2. Modified Tables
- `quote_requests`: admins can read every request.

3. Security
- Row level security enabled on `admin_users`.
- Signed-in users can only see their own row in `admin_users`. Nobody can add or change admin rows from the website; rows are added by the project owner.
- `quote_requests` gets a read-only (SELECT) policy that only passes when the signed-in user has a row in `admin_users`.
- Public visitors (anon role) still have no read access to any request and cannot write to either table.

4. Important notes
- Creating an account on the admin page does NOT grant access. The owner must add the new account's id to `admin_users`.
- No data is changed or removed.
*/

CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON admin_users TO authenticated;

DROP POLICY IF EXISTS "select_own_admin_row" ON admin_users;
CREATE POLICY "select_own_admin_row" ON admin_users FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

GRANT SELECT ON quote_requests TO authenticated;

DROP POLICY IF EXISTS "admins_select_quote_requests" ON quote_requests;
CREATE POLICY "admins_select_quote_requests" ON quote_requests FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));
