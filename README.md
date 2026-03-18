# Quantivo AI Menu - Deployment Guide

This guide will walk you through the steps to publish your application to a free hosting server like **Render** or **Railway**.

## Prerequisites
1. A **GitHub** account.
2. A **Render** account (free tier available).
3. A **Google Gemini API Key** (for the AI Concierge).

---

## Step 1: Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Initialize your local project and push the code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## Step 2: Deploy to Render (Recommended Free Tier)
1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your repository.
4. Configure the service:
   - **Name:** `quantivo-ai-menu` (or any name you like)
   - **Environment:** `Node`
   - **Region:** Choose the one closest to you (e.g., `Oregon` or `Frankfurt`)
   - **Branch:** `main`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

---

## Step 3: Set Environment Variables
Your app requires the Gemini API key to function.
1. In the Render dashboard, go to the **Environment** tab of your service.
2. Add a new secret:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `YOUR_ACTUAL_GEMINI_API_KEY`
3. Add another variable for production mode:
   - **Key:** `NODE_ENV`
   - **Value:** `production`
4. Click **Save Changes**.

---

## Step 4: Verify Deployment
1. Render will start building your app. This might take 2-5 minutes.
2. Once the status is **Live**, click the URL provided by Render (e.g., `https://quantivo-ai-menu.onrender.com`).
3. Your app is now live!

---

## Troubleshooting
- **Port Issue:** The app is configured to run on port `3000`. Render automatically handles this, but if you have issues, ensure your `server.ts` uses `process.env.PORT || 3000`.
- **Cold Starts:** Free tier services on Render "spin down" after 15 minutes of inactivity. The first request after a break might take 30-60 seconds to load.
- **3D Models:** The 3D models are hosted on a cloud CDN (R2), so they will load correctly from any server.

---

## Alternative: Railway
1. Go to [Railway.app](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Railway will automatically detect the `package.json` and use `npm run build` and `npm start`.
4. Add your `GEMINI_API_KEY` in the **Variables** tab.
