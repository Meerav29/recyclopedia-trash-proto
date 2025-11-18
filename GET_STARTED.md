# Get Started with Recyclopedia

Welcome! This guide will get you from zero to deployed in **10 minutes**.

## What You're Building

A web app that:
- 📸 Uses your device camera to scan trash
- 🤖 Uses Google Gemini AI to identify items
- ♻️ Tells you which bin to use (recycling, compost, landfill, etc.)
- 🔒 Keeps your API key secure with serverless functions

## Prerequisites

1. A Google account (for Gemini API)
2. A Vercel account (free) - [Sign up here](https://vercel.com/signup)
3. Terminal/Command line access

## 10-Minute Deployment

### Step 1: Get Gemini API Key (2 minutes)

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click **"Create API Key"**
4. Copy the key (starts with `AIzaSy...`)
5. **Don't close this tab yet** - you'll need it soon!

### Step 2: Clone & Deploy (5 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/recyclopedia-trash-proto.git
cd recyclopedia-trash-proto

# 2. Install Vercel CLI
npm install -g vercel

# 3. Login to Vercel
vercel login
# (Opens browser - login with GitHub, GitLab, or email)

# 4. Deploy to Vercel
vercel
# Answer the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? recyclopedia-trash-proto (or press Enter)
# - Directory? ./ (press Enter)
# - Override settings? N (press Enter)
```

### Step 3: Add API Key (2 minutes)

```bash
# Add your Gemini API key as environment variable
vercel env add GEMINI_API_KEY

# When prompted:
# 1. Paste your Gemini API key (the one you copied in Step 1)
# 2. Select: Production, Preview, Development (press space to select all)
# 3. Press Enter
```

### Step 4: Deploy to Production (1 minute)

```bash
# Deploy to production with your API key
vercel --prod

# You'll get a URL like:
# https://recyclopedia-trash-proto.vercel.app
```

🎉 **Done! Your app is live!**

## Test Your App

1. Visit your deployed URL
2. Click **"Scan Trash"**
3. Allow camera access
4. Point at any trash item (or a picture of one)
5. Click **"Capture Image"**
6. See the AI classification!

## What Just Happened?

1. ✅ Your code was deployed to Vercel's global CDN
2. ✅ Your API key was stored securely in environment variables
3. ✅ A serverless function was created to proxy API calls
4. ✅ Your app is now accessible worldwide via HTTPS

## Next Steps

### Customize Your App

1. **Change bin categories**: Edit `config.js` or `api/classify.js`
2. **Modify prompts**: Update prompts in `gemini-api.js`
3. **Update styling**: Edit `styles.css`
4. **Add features**: Check `README.md` for ideas

### Monitor Usage

1. Visit https://makersuite.google.com/
2. Check your API quota and usage
3. Free tier: 1,500 requests/day

### Share Your App

Your app is live at: `https://your-project-name.vercel.app`

Share it with:
- Friends and family
- Social media
- Your portfolio

## Local Development

Want to develop locally?

```bash
# Create local environment file
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Run local dev server
vercel dev

# Open http://localhost:3000
```

## Troubleshooting

### "API key not configured on server"

**Fix**: Make sure you added the environment variable
```bash
vercel env ls
# Should show GEMINI_API_KEY

# If missing, add it:
vercel env add GEMINI_API_KEY
```

### Camera not working

**Fix**: Make sure:
- You're on HTTPS (Vercel provides this automatically)
- You clicked "Allow" when prompted for camera access
- Your browser supports camera API (Chrome, Firefox, Safari, Edge)

### Deploy failed

**Fix**:
```bash
# Check Vercel logs
vercel logs

# Redeploy
vercel --prod
```

## Understanding the Files

- `index.html` - The web page
- `styles.css` - Design and layout
- `app.js` - Camera and UI logic
- `gemini-api.js` - Handles API calls
- `api/classify.js` - **Serverless function (keeps API key secret)**
- `vercel.json` - Deployment configuration
- `.env.example` - Template for environment variables

## Security Notes

🔒 **Your API key is secure!**

- It's stored in Vercel's encrypted environment variables
- It's never exposed to the browser
- The serverless function acts as a secure proxy
- `.gitignore` prevents accidental commits

See [SECURITY.md](SECURITY.md) for full details.

## Resources

- 📖 [Full README](README.md) - Complete documentation
- 🚀 [Deployment Guide](DEPLOYMENT.md) - Advanced deployment
- 🔒 [Security Guide](SECURITY.md) - Security details
- ⚙️ [Setup Guide](SETUP.md) - Detailed setup instructions

## Common Commands

```bash
# Deploy preview (test changes)
vercel

# Deploy to production
vercel --prod

# View environment variables
vercel env ls

# Add environment variable
vercel env add VARIABLE_NAME

# Remove environment variable
vercel env rm VARIABLE_NAME

# View deployment logs
vercel logs

# Open project in browser
vercel open
```

## Support

Need help?

1. Check the [README.md](README.md)
2. Review [DEPLOYMENT.md](DEPLOYMENT.md)
3. Read [SECURITY.md](SECURITY.md)
4. Open an issue on GitHub

## Congratulations! 🎉

You've successfully deployed an AI-powered web app with:
- ✅ Camera integration
- ✅ Google Gemini AI
- ✅ Serverless backend
- ✅ Secure API key storage
- ✅ Global CDN deployment

Time to start classifying trash and saving the planet! ♻️🌍
