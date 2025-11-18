# Recyclopedia - Smart Trash Classifier

An interactive web application that uses AI to scan and classify trash items, helping users properly sort waste into the correct bins (recycling, compost, landfill, hazardous, etc.).

## Features

- **Camera Integration**: Access device camera (desktop/mobile) with environment camera preference for mobile
- **Smart Detection**: Only processes images when trash is detected
- **Real-time Classification**: Instantly categorizes trash into appropriate bins
- **Multiple Categories**: Supports recycling, plastic, landfill, compost, hazardous, paper, glass, and metal
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Confidence Scoring**: Shows classification confidence percentage
- **User-Friendly UI**: Clean, modern interface with clear instructions

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Camera API**: MediaDevices getUserMedia API
- **AI/ML**: Google Gemini 1.5 Flash (Vision API)
- **Deployment**: Static hosting (Vercel, Netlify, GitHub Pages)

## Getting Started

### Prerequisites

- Modern web browser with camera support
- HTTPS or localhost (required for camera access)
- Google Gemini API key (free tier available)
- Vercel account (for deployment)

### Quick Start

#### Option 1: Deploy to Vercel (Recommended - Secure)

```bash
# Clone the repository
git clone https://github.com/yourusername/recyclopedia-trash-proto.git
cd recyclopedia-trash-proto

# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel

# Add your API key as environment variable
vercel env add GEMINI_API_KEY
# (paste your Gemini API key when prompted)

# Deploy to production
vercel --prod
```

Your app is now live with secure API key storage! 🎉

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

#### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/recyclopedia-trash-proto.git
cd recyclopedia-trash-proto

# Get your Gemini API key from https://makersuite.google.com/app/apikey

# Create .env.local file
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Run with Vercel dev server (includes serverless functions)
vercel dev

# OR run simple static server (for frontend testing only)
python -m http.server 8000
```

For detailed setup instructions, see [SETUP.md](SETUP.md)

### Camera Permissions

- On first use, the browser will request camera permissions
- Ensure you grant camera access for the app to function
- Mobile devices will use the back camera by default

## Project Structure

```
recyclopedia-trash-proto/
├── index.html              # Main HTML structure
├── styles.css              # Responsive CSS styling
├── app.js                  # Camera and UI logic
├── gemini-api.js           # Gemini API integration (supports serverless)
├── config.js               # Optional: Local API config (gitignored)
├── api/
│   └── classify.js         # Vercel serverless function
├── vercel.json             # Vercel deployment configuration
├── .env.example            # Environment variable template
├── .gitignore              # Excludes secrets from git
├── SETUP.md                # Detailed setup guide
├── DEPLOYMENT.md           # Deployment instructions
└── README.md               # Documentation
```

## How It Works

1. **Camera Capture**: User activates camera and captures image of trash
2. **Secure API Call**: Image sent to serverless function (API key never exposed to browser)
3. **Trash Detection**: Serverless function calls Gemini Vision API to detect if trash is present
4. **Classification**: If trash detected, Gemini analyzes and classifies the item
5. **Results Display**: Shows item name, bin category, confidence score, and disposal instructions

### Security Architecture

```
Browser (Frontend)
    ↓ (sends image)
Vercel Serverless Function (/api/classify)
    ↓ (API key stored securely here)
Google Gemini API
    ↓ (returns classification)
Vercel Function
    ↓ (sends result)
Browser (displays result)
```

**Key Security Features:**
- API key stored in environment variables (never in code)
- Serverless function acts as secure proxy
- No API keys exposed to client-side JavaScript
- Production-ready from day one

## Gemini API Integration

This app uses Google's **Gemini 1.5 Flash** model with vision capabilities for:

- **Image Analysis**: Understanding what's in the captured photo
- **Trash Detection**: Determining if the image contains trash/waste items
- **Classification**: Categorizing items into appropriate bin types
- **Smart Instructions**: Providing context-aware disposal guidance

### Key Features

- **No training required**: Uses Gemini's pre-trained vision understanding
- **Natural language prompts**: Easy to customize classification logic
- **Real-time processing**: Fast responses (1-3 seconds)
- **Free tier available**: 15 requests/min, 1,500/day

### API Configuration

The app is structured with:

1. **`config.js`**: Stores your API key and configuration
2. **`gemini-api.js`**: Handles all Gemini API calls
3. **`app.js`**: Coordinates UI and API interactions

Example API call structure:

```javascript
const classifier = new GeminiTrashClassifier(apiKey);

// Detect if image has trash
const hasTrash = await classifier.detectTrash(imageDataUrl);

// Classify the trash item
const result = await classifier.classifyTrash(imageDataUrl);
// Returns: { item, category, confidence, instructions, recyclable }
```

### Production Deployment

✅ **This app is already configured for secure production deployment!**

The API key is stored as an environment variable and accessed through a serverless function.

**What's already set up:**

1. ✅ Serverless function at `/api/classify.js`
2. ✅ Frontend configured to use serverless endpoint
3. ✅ Environment variable configuration in `vercel.json`
4. ✅ `.gitignore` prevents accidental API key commits

**To deploy:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable
vercel env add GEMINI_API_KEY

# Deploy to production
vercel --prod
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

### Customizing Classification

You can modify the prompts in `gemini-api.js` to:

- Add more bin categories
- Change classification criteria
- Adjust confidence thresholds
- Add regional recycling guidelines
- Support multiple languages

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. For API integration, create `/api` folder with serverless functions

### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy
```

### Deploy to GitHub Pages

⚠️ **Note**: GitHub Pages uses HTTPS, but you'll need to implement the backend proxy for API key security (see Production Deployment above).

1. Create backend API endpoint first (Vercel/Netlify function)
2. Update `gemini-api.js` to use your API endpoint
3. Push to GitHub repository
4. Go to Settings > Pages
5. Select branch and root folder
6. Your site will be live at `https://username.github.io/recyclopedia-trash-proto`

## Browser Support

- Chrome 53+
- Firefox 36+
- Safari 11+
- Edge 12+
- Mobile browsers (iOS Safari 11+, Chrome Mobile)

## Security Considerations

✅ **Built-in Security Features:**

- **API Key Protection**: Stored in environment variables, never in code
- **Serverless Proxy**: Frontend never directly accesses Gemini API
- **HTTPS Required**: Camera access requires secure context
- **No Data Storage**: Images processed in real-time, not stored
- **gitignore Protection**: Secrets automatically excluded from version control

**Best Practices:**
- Never commit `.env.local` or `config.js` to Git
- Use separate API keys for development and production
- Monitor API usage in Google AI Studio
- Implement rate limiting if needed
- Validate image sizes before processing

## Future Enhancements

- [ ] Real-time video stream classification
- [ ] Multi-language support
- [ ] Offline PWA mode with service workers
- [ ] User accounts and recycling history
- [ ] Gamification (points, achievements)
- [ ] Location-based recycling guidelines
- [ ] Barcode scanning for packaged items
- [ ] Community-contributed classifications
- [ ] AR overlay for bin placement

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Contact

Your Name - [@yourhandle](https://twitter.com/yourhandle)

Project Link: [https://github.com/yourusername/recyclopedia-trash-proto](https://github.com/yourusername/recyclopedia-trash-proto)

## Acknowledgments

- Kaggle community for trash classification datasets
- TensorFlow.js team for client-side ML capabilities
- Icons from Feather Icons
- Inspiration from environmental conservation efforts