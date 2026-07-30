# Developer Portfolio

A modern, black, premium developer portfolio. The public site starts completely empty — every part of it
(title, hero, about, projects, skills, experience, contact, images, navigation, footer, SEO, and custom pages)
is managed through a password-protected admin panel at `/admin`, similar to a lightweight WordPress.

A second, completely separate private API lets the site owner remotely enable/disable the public site
(e.g. for non-payment) using a hardcoded API key. A third API, authenticated with that same key, lets the
owner disable the site for any other reason with a custom message shown to visitors. Neither is ever used
by the admin panel or the site itself.

## Tech stack

- Next.js (App Router) + TypeScript
- PostgreSQL + Prisma
- Tailwind CSS

## Local setup

1. Install dependencies:

   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the values:

   ```
   DATABASE_URL="postgresql://..."
   ADMIN_PASSWORD="choose-a-strong-password"
   API_KEY="choose-a-random-secret"
   ```

3. Push the schema to your database:

   ```
   npx prisma migrate dev --name init
   ```

4. Run the dev server:

   ```
   npm run dev
   ```

5. Visit `/admin`, log in with `ADMIN_PASSWORD`, and start editing. The public site at `/` will remain
   blank until you add and enable content in the admin panel.

## How it's organized

- `src/app/(site)` — the public website (homepage + custom pages). Gated by the payment status.
- `src/app/admin` — the password-protected admin panel.
- `src/app/api/admin/*` — API routes used only by the admin panel (session-cookie authenticated).
- `src/app/api/payment` — the private owner-only payment-lock API (API-key authenticated, see below).
- `src/app/api/lock` — the private owner-only general disable API with a custom reason (API-key
  authenticated, see below).
- `prisma/schema.prisma` — data model: `Site` (title/branding/nav/footer/SEO), `Section` (hero/about/
  projects/skills/experience/contact, plus free-form custom sections), `Page` (custom pages), `MediaAsset`
  (uploaded images), `PaymentStatus`, `SiteLock`.

Images are uploaded through the admin panel's media library and stored inline in Postgres as base64 data
URIs, so there is no dependency on external storage — uploads are capped at 4MB each.

## The private payment API

`POST /api/payment` (also `GET` to check status) requires the `API_KEY` secret, sent either as:

- `x-api-key: <API_KEY>` header, or
- `Authorization: Bearer <API_KEY>` header

Any request missing or with an incorrect key gets `401 Unauthorized`.

```bash
# Check current status
curl -H "x-api-key: $API_KEY" https://your-site.vercel.app/api/payment

# Flip the current status (paid <-> unpaid)
curl -X POST -H "x-api-key: $API_KEY" https://your-site.vercel.app/api/payment

# Or set it explicitly
curl -X POST -H "x-api-key: $API_KEY" -H "Content-Type: application/json" \
  -d '{"status":"unpaid"}' https://your-site.vercel.app/api/payment
```

When the status is `unpaid`, every public route (homepage and custom pages) immediately renders a
"website disabled" page instead of the portfolio. The admin panel at `/admin` keeps working regardless,
so the site owner (or their client) can still log in — only the public-facing site is affected. This API
is never called by the admin panel or by the site itself.

## The private site-lock API

`POST /api/lock` (also `GET` to check status) is a second, independent kill switch — same look as the
payment lock, but for any other reason (maintenance, a dispute, etc.), with a custom message shown to
visitors. It's authenticated exactly like `/api/payment`, using the same `API_KEY`:

```bash
# Check current status
curl -H "x-api-key: $API_KEY" https://your-site.vercel.app/api/lock

# Disable the site with a visible reason
curl -X POST -H "x-api-key: $API_KEY" -H "Content-Type: application/json" \
  -d '{"locked":true,"reason":"Undergoing scheduled maintenance, back soon."}' \
  https://your-site.vercel.app/api/lock

# Re-enable the site
curl -X POST -H "x-api-key: $API_KEY" -H "Content-Type: application/json" \
  -d '{"locked":false}' https://your-site.vercel.app/api/lock
```

`reason` is required when `locked` is `true` (400 otherwise) and is rendered verbatim on the public
"website disabled" page in place of the default payment message. This lock is independent of the payment
status — either one alone is enough to take the public site down, and the admin panel is unaffected by
both.

## Deploying to Vercel

1. Push this repository to GitHub (or your Git provider of choice) and import it in Vercel.
2. Provision a PostgreSQL database (Vercel Postgres, Neon, Supabase, etc.) and set `DATABASE_URL`.
3. Set the `ADMIN_PASSWORD` and `API_KEY` environment variables in the Vercel project settings.
4. Run `npx prisma migrate deploy` against the production database (locally with `DATABASE_URL` pointed
   at production, or via a Vercel build step) before or during your first deploy.
5. Deploy. Visit `/admin` to start building the site.
