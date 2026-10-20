# Ethiopian Commercial Solar Installer / EPC Company Supabase Backend

This directory contains the database schema and edge functions for the commercial solar engineering and EPC lead generation platform.

## Database Schema: `solar_epc_supabase.sql`

Run `solar_epc_supabase.sql` on a new, empty Supabase project (SQL Editor).

### Schema Tables & Exact Data Contract:
1. `company_settings`: Singleton configuration with contact information, WhatsApp, Telegram URL, response time SLA, service areas, warranty summary, maintenance terms, payment terms, and financing notes.
2. `solar_solutions`: Technical solar solution architectures (Grid-Tied Commercial PV, Solar + Battery BESS, Solar + Diesel Generator Microgrid Hybrid) with capacity limits, suitable facility types, and engineering features.
3. `projects`: Commercial project installations and illustrative technical demonstrations with capacity (kWp), panel/inverter brands, before/after monthly bills (ETB), monthly generation (kWh), and verification notes.
4. `energy_rate_history`: Tariff trajectory tracking Ethiopian Electric Utility (EEU) commercial grid tariff reforms and historical diesel fuel costs with explicit period dates, verification timestamps, and official gazette source URLs.
5. `solar_economics_settings`: Singleton modeling assumptions (offset percentage, installed cost per kWp, forecast escalation, panel degradation, system lifetime) for transparent ROI calculations.
6. `leads`: Commercial assessment requests with monthly electricity bill (ETB), estimated kWh, monthly diesel liters, solution interest, industry sector, facility location, and status lifecycle.
7. `lead_status_events`: Audit trail tracking lead status transitions (`old_status`, `new_status`, `note`, `changed_by`).
8. `trust_items`: Commercial trust items, Ministry of Water and Energy (MoWE) competency licenses, EEU grid compliance certificates, and Tier-1 hardware warranties.
9. `admin_users`: Simple authorization table (`id`, `user_id`, `created_at`) matching authenticated Supabase auth users.

## Supabase Edge Function: `jotform-webhook`

Handles incoming Jotform form submissions and routes them directly into the `leads` table with `source: 'jotform'`.

### Deployment

```bash
supabase functions deploy jotform-webhook --no-verify-jwt
```

### Webhook Endpoint URLs

- Supabase Edge Function: `https://<PROJECT_ID>.supabase.co/functions/v1/jotform-webhook`
- Next.js Proxy Route: `https://<YOUR_DOMAIN>/api/jotform-webhook`
