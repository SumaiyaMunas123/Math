Backend API for Math Class app

Endpoints:
- POST /api/login { password }
- GET /api/content
- POST /api/content (requires Authorization: Bearer <token>)

Notes: currently uses in-memory store; ready to switch to Supabase/Postgres.
