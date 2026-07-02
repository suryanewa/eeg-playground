# Vercel Deployment

This is a static site. Vercel should serve the repository root, not only `dist/`.

## Project Settings

- Framework Preset: Other
- Build Command: `npm run build`
- Output Directory: `.`
- Install Command: Vercel default, or `npm install`

The committed `vercel.json` sets the build command, root output directory, and `/admin` rewrite.

## Environment Variables

Set these in Vercel Project Settings > Environment Variables:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
EEG_PROJECT_ID=00000000-0000-4000-8000-000000000001
```

Only use a Supabase publishable key or legacy anon key in Vercel for this frontend. Never use a service role key.

## Supabase

Run the SQL migration in:

```text
supabase/migrations/20260702184358_client_logo_voting.sql
```

Then create Supabase Auth users and add client users to `project_members`.

## Local Build Check

```bash
npm install
npm run build
python3 -m http.server 4173
```

Open `http://localhost:4173`.
