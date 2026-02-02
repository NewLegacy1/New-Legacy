## Client Intake (production notes)

### Local dev

1) Install deps:

```bash
npm i
```

2) Set env vars (`.env.local`):

```env
# Prisma (Supabase Postgres)
# Example:
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.<project-ref>.supabase.co:5432/postgres"
DATABASE_URL="..."

# Supabase API (recommended for local dev if your network can't reach Postgres 5432)
SUPABASE_URL="https://<project-ref>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="(server-only key)"

# Resend (optional)
RESEND_API_KEY="re_..."
INTAKE_NOTIFY_EMAIL="you@yourdomain.com"
# Optional override (must be a verified sender/domain in Resend)
INTAKE_FROM_EMAIL="New Legacy Intake <intake@yourdomain.com>"

# Uploads (optional)
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."
```

3) Create DB + generate client:

```bash
npx prisma db push
```

Note: Prisma CLI automatically loads `.env` (not `.env.local`) by default. If `prisma db push`
can’t find `DATABASE_URL`, either:

- Create a `.env` file in the project root with the same `DATABASE_URL`, or
- Set it just for the command in PowerShell:

```powershell
$env:DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.<project-ref>.supabase.co:5432/postgres"
npx prisma db push
```

If your ISP/router blocks outbound Postgres (5432) or your network lacks IPv6, you can still
save intakes to Supabase by setting `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. The intake API
will insert into the `intake_submissions` table over HTTPS.

4) Run:

```bash
npm run dev
```

Open `http://localhost:3000/intake`.

### Vercel

Set **Environment Variables** in Vercel (Project → Settings → Environment Variables):

- `DATABASE_URL` (use Postgres later; Prisma schema is compatible)
- `RESEND_API_KEY` (optional)
- `INTAKE_NOTIFY_EMAIL` (optional)
- `INTAKE_FROM_EMAIL` (optional)
- `UPLOADTHING_SECRET` / `UPLOADTHING_APP_ID` (optional)

