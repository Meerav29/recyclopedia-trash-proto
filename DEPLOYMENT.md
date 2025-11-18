# Recyclopedia - Deployment Guide

This guide explains how to deploy Recyclopedia with secure environment variable storage for your Gemini API key.

## Architecture

The app uses a **serverless backend** to keep your API key secure:

```
User Browser → Frontend (HTML/CSS/JS) → Vercel Function (/api/classify) → Gemini API
                                            ↑
                                    API Key stored securely
                                    in environment variables
```

## Deployment to Vercel (Recommended)

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Get Your Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (keep it safe!)

### Step 3: Deploy to Vercel

```bash
# Navigate to your project directory
cd recyclopedia-trash-proto

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? recyclopedia-trash-proto
# - Directory? ./
# - Override settings? No
```

### Step 4: Add Environment Variable

After deploying, add your API key:

#### Option A: Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key (paste it here)
   - **Environment**: Production, Preview, Development (check all)
5. Click **Save**

#### Option B: Via CLI

```bash
vercel env add GEMINI_API_KEY
# When prompted, paste your API key
# Select: Production, Preview, Development
```

### Step 5: Redeploy

```bash
# Deploy to production
vercel --prod
```

Your app is now live! 🎉

The URL will be something like: `https://recyclopedia-trash-proto.vercel.app`

## Deployment to Netlify

### Step 1: Install Netlify CLI

```bash
npm i -g netlify-cli
```

### Step 2: Create Netlify Function

First, update the project structure for Netlify:

```bash
# Create netlify functions directory
mkdir -p netlify/functions
```

Copy the API function:

```bash
cp api/classify.js netlify/functions/classify.js
```

Create `netlify.toml`:

```toml
[build]
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Step 3: Deploy

```bash
# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### Step 4: Add Environment Variable

```bash
# Via CLI
netlify env:set GEMINI_API_KEY "your-api-key-here"

# Or via Netlify Dashboard:
# Site Settings → Environment Variables → Add Variable
```

## Local Development

For local development, you can use the serverless function locally:

### Option 1: Vercel Dev (Recommended)

```bash
# Create .env.local file
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Run Vercel dev server
vercel dev

# App will be available at http://localhost:3000
```

### Option 2: Direct API (Development Only)

If you want to test without serverless locally:

1. Update `app.js`:
```javascript
const useServerless = false; // Change to false
geminiClassifier = new GeminiTrashClassifier(CONFIG.GEMINI_API_KEY, useServerless);
```

2. Add your API key to `config.js`

3. Run local server:
```bash
python -m http.server 8000
```

**⚠️ Important**: Always set back to `useServerless = true` before deploying!

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Your Google Gemini API key |

## Testing Your Deployment

1. Visit your deployed URL
2. Open browser console (F12)
3. Look for: `✅ Gemini API initialized successfully (serverless mode)`
4. Click "Scan Trash" and test with an image
5. Check the Network tab to verify API calls go to `/api/classify`

## Troubleshooting

### "API key not configured on server"

**Problem**: Environment variable not set on Vercel/Netlify

**Solution**:
1. Go to your hosting dashboard
2. Navigate to Environment Variables
3. Add `GEMINI_API_KEY` with your API key
4. Redeploy the app

### "fetch failed" or CORS errors

**Problem**: API endpoint not accessible

**Solution**:
- Make sure `vercel.json` or `netlify.toml` is in your repo
- Check that the `/api` route is configured correctly
- Redeploy after making changes

### Local development not working

**Problem**: Vercel dev server issues

**Solution**:
```bash
# Make sure .env.local exists
cat .env.local

# Should show: GEMINI_API_KEY=your_key

# Restart Vercel dev
vercel dev
```

## Security Best Practices

✅ **DO**:
- Store API key in environment variables
- Use serverless functions for API calls
- Keep `.env.local` in `.gitignore`
- Use different API keys for dev/prod

❌ **DON'T**:
- Commit API keys to Git
- Expose API keys in client-side code
- Share API keys publicly
- Use production keys in development

## Updating Your Deployment

```bash
# Make changes to your code
git add .
git commit -m "Update feature"

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Monitoring

### Vercel Analytics

Enable analytics in Vercel dashboard to monitor:
- Page views
- API function calls
- Performance metrics

### API Usage

Monitor your Gemini API usage:
- Visit https://makersuite.google.com/
- Check quota and usage stats
- Set up alerts for rate limits

## Cost Optimization

### Gemini API Free Tier
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per month

### Tips to Stay in Free Tier
1. Implement client-side caching
2. Add request throttling
3. Optimize image sizes before sending
4. Use efficient prompts

## Custom Domain

### On Vercel

1. Go to project settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. Wait for SSL certificate (automatic)

Your app will be available at your custom domain!

## Next Steps

- Set up monitoring and alerts
- Implement analytics
- Add error tracking (Sentry, etc.)
- Create staging environment
- Set up CI/CD pipeline

Happy deploying! 🚀
