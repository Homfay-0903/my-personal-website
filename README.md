# my-personal-website

Personal portfolio built with **Next.js (App Router) + Convex + Convex Auth (email/password)**.
Bilingual (EN/ZH), blueprint-style design system, with a private admin panel to manage projects.

## Tech stack

- Next.js 16 (App Router, Tailwind v4, TypeScript, Turbopack)
- Convex — database, file storage, and backend functions
- Convex Auth — email + password authentication
- next-themes — light/dark mode

## Local development

```bash
npm install

# 1. Start the Convex local backend (runs on http://127.0.0.1:3210)
npx convex dev

# 2. In a second terminal, start Next.js
npm run dev
```

Open http://localhost:3000.

`.env.local` (already created locally, see `.env.example` for the shape):

| Variable | Local value | Production value |
|---|---|---|
| `CONVEX_DEPLOYMENT` | `anonymous:anonymous-my-personal-website` | (set by Vercel integration) |
| `NEXT_PUBLIC_CONVEX_URL` | `http://127.0.0.1:3210` | your `*.convex.site` URL |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | `http://127.0.0.1:3211` | your `*.convex.site` URL |

## Seeding sample data

```bash
npx convex run seed
```

## Admin panel

`/admin` — sign up/log in with email + password, then activate admin with the setup secret.

> **Before going live, replace `ADMIN_SETUP_SECRET` in `convex/constants.ts`**
> with a secret of your own, then redeploy (and re-run `npx convex push` locally).

## Deploying to Vercel + Convex (production)

1. Create a project at https://convex.new — you get a deployment URL like
   `https://excited-elephant-123.convex.site`. Note the deployment name.
2. Push the schema & code to production:

   ```bash
   # log in to Convex
   npx convex login
   # point at the production deployment
   npx convex deploy <deployment-name>
   ```

3. On Vercel: import the GitHub repo. In **Environment Variables** add:

   - `CONVEX_DEPLOYMENT` = the production deployment name (e.g. `excited-elephant-123`)
   - `NEXT_PUBLIC_CONVEX_URL` = `https://<deployment-name>.convex.site`
   - `NEXT_PUBLIC_CONVEX_SITE_URL` = `https://<deployment-name>.convex.site`

4. Deploy. Then in a terminal:

   ```bash
   npx convex run seed --prod   # optional: seed sample projects
   ```

5. Open `https://your-app.vercel.app/admin`, create your account, and activate it as admin using the activation code (which verifies against `ADMIN_SETUP_SECRET`).

## Scripts

- `npm run dev` — Next.js dev server
- `npm run build` / `npm run start` — production build & run
- `npm run lint` — ESLint
- `npx convex dev` — local Convex backend (start before `npm run dev`)
- `npx convex run <function>` — run a backend function, e.g. `seed`
