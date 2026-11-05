/*
# Route quote requests through a server function only

1. Security changes
- Removes the public insert policy on `quote_requests`.
- Revokes insert from the public (anon) and signed-in roles.
- Grants insert to `service_role`, used only by the `submit-quote-request` server function.

2. Why
- The server function validates every field, saves the request, then emails the business.
- Visitors can no longer write directly to the table, which blocks spam and invalid rows.

3. Important notes
- No existing data is changed or removed.
- Row level security stays enabled, and public visitors still cannot read any request.
*/

DROP POLICY IF EXISTS "anon_insert_quote_requests" ON quote_requests;

REVOKE INSERT ON quote_requests FROM anon, authenticated;

GRANT INSERT ON quote_requests TO service_role;
