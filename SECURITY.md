# Security Implementation Guide

This document explains how Recyclopedia keeps your Gemini API key secure.

## The Problem

Storing API keys in client-side JavaScript is a security risk:

```javascript
// ❌ INSECURE - API key exposed in browser
const apiKey = "AIzaSyXXXXXXXXXXXXXXXXX";
fetch(`https://api.example.com?key=${apiKey}`);
```

Anyone can:
- View the key in browser DevTools
- Extract it from your JavaScript files
- Use it for their own purposes
- Rack up charges on your account

## Our Solution: Serverless Functions

Recyclopedia uses a **serverless proxy** to keep your API key secure:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Browser (Client-Side)                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ No API key in code ✅                                 │  │
│  │ Calls: /api/classify                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Vercel Serverless Function (Server-Side)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ API key stored in environment variable 🔒            │  │
│  │ const apiKey = process.env.GEMINI_API_KEY;           │  │
│  │                                                       │  │
│  │ Proxies request to Gemini API                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
                   Gemini API (Google)
```

## How It Works

### 1. Frontend (`gemini-api.js`)

```javascript
// No API key needed!
const classifier = new GeminiTrashClassifier(null, true);

// Calls our serverless function
const result = await classifier.classifyTrash(imageData);
```

The frontend:
- Never sees or stores the API key
- Sends requests to `/api/classify` (our backend)
- Receives classification results

### 2. Backend (`api/classify.js`)

```javascript
export default async function handler(req, res) {
    // Get API key from secure environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    // Call Gemini API with the key
    const response = await fetch(
        `https://generativelanguage.googleapis.com/...?key=${apiKey}`,
        { /* ... */ }
    );

    // Return result to frontend
    res.json(data);
}
```

The backend:
- Runs on Vercel's secure servers
- Accesses API key from environment variables
- Makes actual API calls to Gemini
- Returns results to frontend

### 3. Environment Variables

```bash
# Stored securely on Vercel (never in code)
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXX
```

## Security Features

### ✅ What's Protected

| Feature | How It's Protected |
|---------|-------------------|
| API Key | Stored in environment variables, not in code |
| Git Repository | `.gitignore` excludes all sensitive files |
| Client-Side Code | No secrets exposed to browser |
| Network Requests | API key never sent to client |
| Environment Files | `.env.local` and `config.js` are gitignored |

### 🔒 Multiple Layers of Protection

1. **Environment Variables**: API key only accessible on server
2. **`.gitignore`**: Prevents accidental commits of secrets
3. **Serverless Function**: Acts as secure proxy
4. **HTTPS**: All communication encrypted
5. **No Storage**: Images processed in real-time, not stored

## Deployment Security Checklist

Before deploying, ensure:

- [ ] API key is set as environment variable on Vercel
- [ ] `config.js` is in `.gitignore`
- [ ] `.env.local` is in `.gitignore`
- [ ] No hardcoded API keys in any files
- [ ] `useServerless = true` in `app.js`
- [ ] Serverless function is working (`/api/classify`)

## Verifying Security

### ✅ Good Signs

1. Open browser DevTools → Network tab
2. Capture an image
3. Look for request to `/api/classify`
4. Check request headers - no API key visible ✅

### ❌ Warning Signs

If you see:
- API key in Network tab requests
- API key in JavaScript files
- Requests directly to `googleapis.com` from browser
- `config.js` not in `.gitignore`

→ **Stop!** Review security setup.

## Common Security Mistakes

### ❌ Mistake 1: Committing API Key

```bash
# Check what's being committed
git status

# If you see config.js or .env files:
git reset HEAD config.js
echo "config.js" >> .gitignore
```

### ❌ Mistake 2: Hardcoding API Key

```javascript
// ❌ DON'T DO THIS
const apiKey = "AIzaSyXXXXXXX";

// ✅ DO THIS (serverless function only)
const apiKey = process.env.GEMINI_API_KEY;
```

### ❌ Mistake 3: Forgetting to Set Environment Variable

```bash
# After deployment, verify:
vercel env ls

# Should show GEMINI_API_KEY
# If not, add it:
vercel env add GEMINI_API_KEY
```

## Testing Security Locally

### Test 1: Check `.gitignore`

```bash
# This should show config.js is ignored
git status

# If config.js appears, it's NOT ignored!
# Add it to .gitignore immediately
```

### Test 2: Verify Serverless Function

```bash
# Run local dev server
vercel dev

# Visit http://localhost:3000
# Open DevTools → Network
# Capture image
# Verify request goes to /api/classify
```

### Test 3: Check for Exposed Keys

```bash
# Search your code for API keys
grep -r "AIzaSy" .

# Should only appear in:
# - .env.local (gitignored)
# - config.js (gitignored)
# NOT in any tracked files!
```

## Incident Response

### If API Key is Compromised

1. **Immediately revoke the key**:
   - Go to https://makersuite.google.com/
   - Delete the compromised key

2. **Generate new key**:
   - Create a new API key
   - Update environment variable on Vercel

3. **Update deployment**:
   ```bash
   vercel env add GEMINI_API_KEY
   # Enter new key
   vercel --prod
   ```

4. **Review git history**:
   ```bash
   git log --all --full-history -- config.js
   # If key was committed, consider the repo compromised
   ```

## Best Practices

### Development

- ✅ Use `.env.local` for local API keys
- ✅ Never commit `.env.local` to Git
- ✅ Use different API keys for dev/prod
- ✅ Test with `vercel dev` before deploying

### Production

- ✅ Set environment variables via Vercel dashboard
- ✅ Use Vercel's secret encryption
- ✅ Monitor API usage regularly
- ✅ Set up usage alerts in Google AI Studio
- ✅ Rotate API keys periodically

### Code Review

Before committing:
- ✅ No hardcoded secrets
- ✅ `.gitignore` is up to date
- ✅ Serverless functions handle API calls
- ✅ No API keys in client-side code

## Compliance

This security implementation helps with:

- **GDPR**: No user data stored, images processed in real-time
- **SOC 2**: API keys stored in encrypted environment variables
- **Best Practices**: Industry-standard serverless architecture
- **Zero Trust**: Frontend never has access to credentials

## Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Google Cloud Security Best Practices](https://cloud.google.com/docs/security/best-practices)
- [OWASP API Security](https://owasp.org/www-project-api-security/)

## Questions?

If you're unsure about any security aspect:

1. Review this document
2. Check [DEPLOYMENT.md](DEPLOYMENT.md)
3. Verify your setup against the checklist
4. When in doubt, regenerate your API key

**Remember**: If a key is exposed, assume it's compromised and rotate it immediately.

Stay secure! 🔒
