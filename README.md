# Full Circle Formations

The LLC formation app for Full Circle Financial Group. Clients pick a path (new LLC, holding company, or existing LLC), are walked through 5 steps by an AI guide, pay with Stripe, and then track their filing and download documents in their portal. You run everything from the admin area.

**Stack:** Next.js 15 · Supabase (database, sign-in, file storage) · Stripe Checkout · Claude for the AI guide · hosted on Vercel.

---

## Launch checklist (about 45 minutes, one time)

### 1. Supabase: database and sign-in
1. Create a free project at **supabase.com**.
2. Open **SQL Editor → New query**, paste everything in `supabase/migrations/0001_init.sql`, and click **Run**. Then do the same with `0002_growth_offers.sql`.
3. **Authentication → URL Configuration**: set *Site URL* to your live address (for example `https://formations.fullcircle-credit.com`), and add `https://YOUR-SITE/auth/callback` under *Redirect URLs*.
4. Optional, for Google sign-in: **Authentication → Providers → Google**. Follow Supabase's steps to paste in a Google client ID and secret.
5. **Project Settings → API**: copy the *Project URL*, the *anon* key and the *service_role* key for step 4 below.

### 2. Stripe: payments
1. In **dashboard.stripe.com → Developers → API keys**, copy the *Secret key*. Use test mode first.
2. **Developers → Webhooks → Add endpoint**:
   URL `https://YOUR-SITE/api/stripe/webhook`, event `checkout.session.completed`. Copy the *signing secret* (`whsec_…`).

### 3. AI guide
Create an API key at **console.anthropic.com** and copy it.

### 4. Vercel: put it live
1. At **vercel.com → Add New → Project**, import this GitHub repo.
2. Under *Environment Variables*, add every line from `.env.example` with your real values. Set `NEXT_PUBLIC_SITE_URL` to your live address.
3. Click **Deploy**. Every new push to GitHub redeploys automatically.
4. Optional: in **Settings → Domains**, connect a domain such as `formations.fullcircle-credit.com`.

### 5. Make yourself the admin
Sign up in the live app with your email. Then run this in the Supabase SQL Editor:
```sql
update public.profiles set role = 'admin' where email = 'Breyon@fullcircle-credit.com';
```
**Profile → Open admin** now appears for you.

### 6. Before taking real money
- **Admin → Prices**: enter each state's current LLC filing fee from that state's official site. Blank fees aren't charged and show as "Confirmed after order."
- Set prices for the Business identity kit and Virtual office, or leave them blank to quote them by hand.
- Place a test order with Stripe's test card `4242 4242 4242 4242`. Confirm it shows as *Order received* in the portal and in Admin.
- Swap the Stripe test key for the live key in Vercel and redeploy.

---

## How it works

| Where | What |
|---|---|
| `/` | Welcome: choose a path |
| `/start/new_llc`, `/start/holding`, `/start/existing` | 5-step guided flow with the AI guide, saved in the browser as clients go |
| `/login` | Google or email-link sign-in (asked only at checkout) |
| `/portal` | Filing tracker + "Your next moves" (business credit, protection, personal credit → your booking link) |
| `/portal/documents` | Files you upload for the client (private, opened with short-lived links) |
| `/admin` | All orders, status updates (these drive the client's tracker), document uploads, notes |
| `/admin/clients` | Every client who signed up: contact info, what they signed up for, status, amount paid, where they came from. Filter by service, search, and **download a spreadsheet (CSV)** |
| `/admin/prices` | Package, add-on and state-fee prices (including the business credit start price) |

**Order statuses:** Request received (free reviews only, no payment) · Awaiting payment → Order received (set automatically when Stripe confirms payment) → Filed with the state → Approved + EIN → S-corp election filed → Complete.

**Security:** row-level security means clients can only ever read their own orders and documents. Prices are always recalculated on the server from the database, never taken from the browser.

## Run it on a computer (for a developer)
```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                   # http://localhost:3000
```

## Growth offers
- **Business credit builder:** "Get started for $500" on the welcome screen and in step 4. Change the amount in Admin → Prices.
- **Free sign-ups:** funding readiness review, personal credit review and protection plan quote. Clients tap to add them; if that's all they choose, no payment is needed and the request lands in Admin → Clients.
- Each order records where it came from (`source`), e.g. `welcome:business_credit` for the welcome-screen card.

## Tracking clients
Every sign-up is saved in Supabase (`orders` + `profiles`). See it in **Admin → Clients**, or download it as a CSV for Excel or Google Sheets. Payments also show in your Stripe dashboard. Clients who started checkout but didn't pay show as "Awaiting payment" — good follow-up calls.
