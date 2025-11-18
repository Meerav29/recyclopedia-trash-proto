# Recyclopedia - Gemini API Setup Guide

This guide will walk you through setting up the Gemini API for trash classification.

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy your API key (it will look like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

**Important:** Keep this API key secure and never commit it to version control!

## Step 2: Configure Your API Key

1. Open the `config.js` file in your project
2. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:

```javascript
const CONFIG = {
    GEMINI_API_KEY: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // Your actual API key
    // ... rest of config
};
```

## Step 3: Run the Application

### Option 1: Using Python (Recommended)

```bash
# Make sure you're in the project directory
cd recyclopedia-trash-proto

# Start a local server
python -m http.server 8000
```

Then open your browser to: `http://localhost:8000`

### Option 2: Using Node.js

```bash
# Install http-server if you haven't already
npm install -g http-server

# Run the server
http-server -p 8000
```

### Option 3: Using Live Server (VS Code Extension)

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Step 4: Test the Application

1. Click the **"Scan Trash"** button to activate your camera
2. Grant camera permissions when prompted
3. Point your camera at a trash item (or use a picture on another screen)
4. Click **"Capture Image"** to scan
5. Wait for Gemini AI to classify the item
6. View the results with bin category and disposal instructions!

## Troubleshooting

### "API key not configured" warning

**Solution:** Make sure you've replaced `YOUR_GEMINI_API_KEY_HERE` in `config.js` with your actual API key.

### Camera not working

**Possible causes:**
- Camera permissions not granted - click "Allow" when prompted
- Using HTTP instead of HTTPS (camera requires secure context)
- **Solution:** Use `localhost` or deploy to HTTPS server

### Gemini API errors

**Common errors:**

1. **"API key not valid"**
   - Check that you copied the full API key
   - Verify the API key is active in Google AI Studio

2. **"Quota exceeded"**
   - You've reached the free tier limit
   - Check your quota at [Google AI Studio](https://makersuite.google.com/)

3. **"Resource exhausted"**
   - Too many requests in a short time
   - Wait a few seconds and try again

### CORS errors

If you see CORS errors in the console:
- Make sure you're running through a local server (not opening the file directly)
- Use `http://localhost:8000` instead of `file:///`

## Security Best Practices

### For Development

1. **Never commit your API key to Git:**
   ```bash
   # Add config.js to .gitignore
   echo "config.js" >> .gitignore
   ```

2. **Create a template file:**
   - Keep `config.js` with your actual key locally
   - Create `config.template.js` for version control:

   ```javascript
   const CONFIG = {
       GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE',
       // ...
   };
   ```

### For Production

For production deployment, **DO NOT** expose your API key in client-side code!

Instead, create a backend API:

1. **Create a serverless function** (Vercel, Netlify, etc.)
2. **Store API key in environment variables**
3. **Frontend calls your backend**, backend calls Gemini

Example Vercel serverless function (`/api/classify.js`):

```javascript
export default async function handler(req, res) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        }
    );

    const data = await response.json();
    res.json(data);
}
```

Then update your frontend to call `/api/classify` instead of calling Gemini directly.

## API Limits (Free Tier)

- **15 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**

For higher limits, check [Gemini API Pricing](https://ai.google.dev/pricing)

## Next Steps

- Test with different types of trash
- Adjust the prompts in `gemini-api.js` for better accuracy
- Add more bin categories in `config.js`
- Deploy to production with proper backend API

## Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Get API Key](https://makersuite.google.com/app/apikey)
- [Gemini API Pricing](https://ai.google.dev/pricing)
- [Project README](README.md)

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is correct
3. Ensure you're within API rate limits
4. Review the troubleshooting section above

Happy recycling!
