// Configuration template file
// Copy this file to config.js and add your actual API key

const CONFIG = {
    // Get your Gemini API key from: https://makersuite.google.com/app/apikey
    GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE',

    // Gemini API endpoint
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',

    // Model configuration
    MODEL_CONFIG: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
    },

    // Trash classification categories
    BIN_CATEGORIES: [
        'recycling',
        'plastic',
        'landfill',
        'compost',
        'hazardous',
        'paper',
        'glass',
        'metal'
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
