# Recyclopedia - Quick Start Guide

Get up and running in 5 minutes!

## 1. Get API Key (2 minutes)

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key (looks like: `AIzaSy...`)

## 2. Configure (1 minute)

```bash
# Copy template to config.js
cp config.template.js config.js

# Edit config.js and paste your API key
# Replace: YOUR_GEMINI_API_KEY_HERE
# With: AIzaSy... (your actual key)
```

## 3. Run (1 minute)

```bash
# Start server
python -m http.server 8000

# Open browser
# Go to: http://localhost:8000
```

## 4. Test (1 minute)

1. Click "Scan Trash"
2. Allow camera access
3. Point at any trash item
4. Click "Capture Image"
5. See the results!

## Done!

You're now ready to classify trash with AI.

## Need Help?

- **API Issues**: See [SETUP.md](SETUP.md)
- **Camera Problems**: Grant permissions & use localhost
- **Questions**: Check [README.md](README.md)

## Tips

- Works best with clear, well-lit photos
- Hold items against plain backgrounds
- Try different types: plastic, glass, paper, etc.
- Test with food waste for compost classification

## Next Steps

- Customize bin categories in `config.js`
- Modify prompts in `gemini-api.js`
- Deploy to production (see README)
- Add your own styling

Happy recycling! ♻️
