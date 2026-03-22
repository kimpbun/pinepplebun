# 🍍 Deploy Pineapple Bun AI — Step by Step

## What you need
- This folder (you have it)
- A Vercel account (free) — vercel.com
- Your domain: pineapplebun.ai (you have it)

---

## Step 1 — Upload to Vercel (5 minutes)

1. Go to **vercel.com** and sign in with Kim.pbun@gmail.com
2. Click **"Add New Project"**
3. Click **"Browse"** or drag this entire folder in
4. Vercel detects it as a Vite/React project automatically
5. Click **"Deploy"**
6. Wait ~60 seconds — you get a live URL like `pineapplebun-ai.vercel.app`

---

## Step 2 — Connect your domain (5 minutes)

1. In Vercel, go to your project → **Settings → Domains**
2. Type `pineapplebun.ai` and click **Add**
3. Vercel shows you two DNS records to add
4. Log into your domain registrar (Porkbun / Cloudflare)
5. Add the DNS records Vercel gives you
6. Wait 5–10 minutes for DNS to update
7. Your site is live at **pineapplebun.ai** ✓

---

## Step 3 — Test the form (2 minutes)

1. Go to pineapplebun.ai
2. Fill in the contact form and submit
3. Check Kim.pbun@gmail.com — email should arrive within 30 seconds
4. The client also gets a confirmation from Formspree

---

## That's it. You're live.

Once deployed everything works:
✓ Contact form → emails Kim.pbun@gmail.com
✓ Formspree ID: xeerwpwp (already in the code)
✓ All payment options shown (Card, USDC, USDT, ETH, BTC)
✓ Agent API page
✓ Aria chat widget on Nine Blocks demo

---

## If you get stuck

The most common issue is DNS propagation — it can take up to 24 hours
but usually under 10 minutes with Cloudflare.

Check DNS status at: dnschecker.org
