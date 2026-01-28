# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment (important)

### GitHub Pages is **not supported** for server runtimes

GitHub Pages only serves static files. It does **not** run Node.js, API routes, or server-side code. If your app relies on `/app/api`, HTTP-only cookie sessions, Prisma, or any server runtime, **do not deploy to GitHub Pages** or you will see a white screen or failing API calls.

### Recommended production deployment (server runtime required)

Use a platform that supports Node.js server runtimes, such as **Vercel**, **Render**, **Fly.io**, or **Railway**.

General steps for a Next.js App Router full‑stack setup:

1. **Environment variables**
   - `DATABASE_URL` — Postgres connection string (e.g., Neon/Supabase/Postgres).
   - Any auth/session secrets required by your app.

2. **Database migrations (Prisma)**
   - Run: `npx prisma migrate deploy`
   - Ensure your CI/CD or hosting platform runs this before starting the server.

3. **HTTPS + secure cookies**
   - Use `secure: true` for cookies in production.
   - Configure `sameSite` and `httpOnly` for session cookies.

4. **Build + start scripts**
   - `npm run build`
   - `npm run start`

5. **Server runtime for API routes**
   - Ensure API routes run in **Node.js runtime** (not Edge) if you use Node-only APIs like `crypto`.

### Health check endpoint

For server-hosted deployments, expose a simple health endpoint at `/api/health` that returns `200 OK` and basic status JSON. This is commonly used by hosting platforms for health checks.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
