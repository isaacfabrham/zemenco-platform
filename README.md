# Zemen Co. AI Platform

This is a Next.js 14 application powered by Supabase, Stripe, and Anthropic's Claude. It allows users to subscribe to a tier and instantly generate their own professional website using an interactive AI chatbot builder.

## Prerequisites

Before you begin, ensure you have the following API keys ready:
- **Supabase**: URL, Anon Key, and Service Role Key (Admin)
- **Anthropic**: API Key (`claude-3-5-sonnet-20240620`)
- **Ollama**: Self-hosted URL and models (`llama3.1:70b`, `llama3.1:8b`, `nomic-embed-text`)
- **OpenRouter**: API Key for fallback
- **Redis**: Connection string for BullMQ queue
- **Stripe**: Publishable Key, Secret Key, and Webhook Secret

## Local Setup

1. **Environment Variables**
   Copy the example environment file and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```
   *(Note: Never commit `.env.local` to GitHub! It is already listed in `.gitignore`.)*

2. **Database Setup (Supabase)**
   Execute the contents of `supabase/schema.sql` AND `supabase/migrations/20260501_zemen_agent.sql` in your Supabase SQL Editor. This sets up the core tables and the specialized agent memory (pgvector), error logging, and version history tables.

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment Pipeline (GitHub + Vercel)

We use Vercel for CI/CD. The pipeline is set up so that pushes to `main` deploy to production (`zemenco.com`), while pushes to `dev` trigger preview deployments.

### 1. Initialize Git & GitHub
Run the following commands in your terminal to create the `zemenco-platform` repository and push the code:
```bash
git init
git add .
git commit -m "Initial commit: Zemen Co Platform Migration"
git branch -M main
# Replace <YOUR_GITHUB_USERNAME> below
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/zemenco-platform.git
git push -u origin main
```

### 2. Connect to Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
2. Import the `zemenco-platform` repository from GitHub.
3. In the **Environment Variables** section, copy the variables from your `.env.local` file.
4. Click **Deploy**.

### 3. Stripe Webhook Configuration
Once your Vercel app is deployed (e.g., `https://zemenco-platform.vercel.app`), go to your Stripe Dashboard > Developers > Webhooks.
1. Add an endpoint pointing to: `https://zemenco-platform.vercel.app/api/payments/webhook`
2. Select the following events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
3. Reveal the **Signing Secret**, and add it to your Vercel Environment Variables as `STRIPE_WEBHOOK_SECRET`. Redeploy your Vercel project to apply the new secret.

## Security Architecture
- **No API Keys on Frontend**: Claude, Stripe, and Supabase Service keys are all isolated in secure server-side routes (`/api/claude`, `/api/payments`, `utils/supabase/admin.ts`).
- **Data Protection**: Supabase RLS policies guarantee users can only read and write their own dashboard and site data.
- **Route Protection**: Next.js Middleware strictly gates `/dashboard` and `/build` routes behind active sessions.
