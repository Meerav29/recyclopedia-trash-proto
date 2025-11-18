// Gemini API Integration for Trash Classification

class GeminiTrashClassifier {
    constructor(apiKey = null, useServerless = true) {
        this.apiKey = apiKey;
        this.useServerless = useServerless;

        // Use serverless endpoint by default (secure)
        // For local development, you can set useServerless to false
        if (useServerless) {
            this.apiUrl = '/api/classify';
        } else {
            this.apiUrl = CONFIG?.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        }
    }

    /**
     * Convert image data URL to base64 (remove the data:image prefix)
     */
    extractBase64FromDataUrl(dataUrl) {
        const base64Data = dataUrl.split(',')[1];
        return base64Data;
    }

    /**
     * Get image MIME type from data URL
     */
    getMimeType(dataUrl) {
        const matches = dataUrl.match(/^data:([^;]+);/);
        return matches ? matches[1] : 'image/jpeg';
    }

    /**
     * Detect if there's trash in the image using Gemini Vision
     */
    async detectTrash(imageDataUrl) {
        const base64Image = this.extractBase64FromDataUrl(imageDataUrl);
        const mimeType = this.getMimeType(imageDataUrl);

        const requestBody = {
            contents: [{
                parts: [
                    {
                        text: `Analyze this image and determine if it contains any trash, waste, or recyclable items.

Respond with ONLY a JSON object in this exact format:
{
    "hasTrash": true or false,
    "reasoning": "brief explanation"
}

If the image shows trash, waste, recyclable materials, packaging, containers, or any disposable items, set hasTrash to true.
If the image shows people, scenery, objects that aren't trash, or is unclear, set hasTrash to false.`
                    },
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Image
                        }
                    }
                ]
            }],
            generationConfig: CONFIG?.MODEL_CONFIG || {
                temperature: 0.4,
                topK: 32,
                topP: 1,
                maxOutputTokens: 2048,
            }
        };

        try {
            // If using serverless, don't include API key in URL
            const fetchUrl = this.useServerless ? this.apiUrl : `${this.apiUrl}?key=${this.apiKey}`;

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const textResponse = data.candidates[0]?.content?.parts[0]?.text || '';

            // Parse the JSON response
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                return result.hasTrash;
            }

            return false;
        } catch (error) {
            console.error('Error detecting trash:', error);
            throw error;
        }
    }

    /**
     * Classify the trash item using Gemini Vision
     */
    async classifyTrash(imageDataUrl) {
        const base64Image = this.extractBase64FromDataUrl(imageDataUrl);
        const mimeType = this.getMimeType(imageDataUrl);

        const prompt = `You are an expert waste management AI assistant. Analyze this image of trash/waste and classify it.

Identify:
1. What the item is (be specific, e.g., "Plastic Water Bottle", "Aluminum Soda Can")
2. Which bin category it belongs to from these options:
   - recycling: General recyclable items
   - plastic: Plastic-specific recycling
   - paper: Paper and cardboard recycling
   - glass: Glass recycling
   - metal: Metal/aluminum recycling
   - compost: Organic/food waste
   - landfill: Non-recyclable general waste
   - hazardous: Batteries, electronics, chemicals, medical waste

3. Confidence score (0.0 to 1.0)
4. Disposal instructions (brief, helpful advice)

Respond with ONLY a JSON object in this exact format:
{
    "item": "Item name",
    "category": "category_name",
    "confidence": 0.95,
    "instructions": "Brief disposal instructions",
    "recyclable": true or false
}

Example:
{
    "item": "Plastic Water Bottle",
    "category": "plastic",
    "confidence": 0.95,
    "instructions": "Remove cap and rinse before recycling",
    "recyclable": true
}`;

        const requestBody = {
            contents: [{
                parts: [
                    {
                        text: prompt
                    },
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Image
                        }
                    }
                ]
            }],
            generationConfig: CONFIG?.MODEL_CONFIG || {
                temperature: 0.4,
                topK: 32,
                topP: 1,
                maxOutputTokens: 2048,
            }
        };

        try {
            // If using serverless, don't include API key in URL
            const fetchUrl = this.useServerless ? this.apiUrl : `${this.apiUrl}?key=${this.apiKey}`;

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const textResponse = data.candidates[0]?.content?.parts[0]?.text || '';

            console.log('Gemini response:', textResponse);

            // Extract JSON from response
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);

                // Validate and format the result
                return {
                    item: result.item || 'Unknown Item',
                    category: this.validateCategory(result.category),
                    confidence: result.confidence || 0.5,
                    instructions: result.instructions || 'Please check local recycling guidelines.',
                    recyclable: result.recyclable || false
                };
            }

            throw new Error('Could not parse classification result');

        } catch (error) {
            console.error('Error classifying trash:', error);
            throw error;
        }
    }

    /**
     * Validate that the category is one of our accepted categories
     */
    validateCategory(category) {
        const validCategories = CONFIG?.BIN_CATEGORIES || [
            'recycling', 'plastic', 'landfill', 'compost',
            'hazardous', 'paper', 'glass', 'metal'
        ];
        if (validCategories.includes(category)) {
            return category;
        }

        // Default to landfill if category is invalid
        console.warn(`Invalid category "${category}", defaulting to landfill`);
        return 'landfill';
    }

    /**
     * Check if API is configured
     * When using serverless, always return true (API key is on server)
     * When using client-side, check if API key is set
     */
    isConfigured() {
        if (this.useServerless) {
            return true; // API key is managed on server
        }
        return this.apiKey && this.apiKey !== 'YOUR_GEMINI_API_KEY_HERE';
    }
}

// Make it globally available
if (typeof window !== 'undefined') {
    window.GeminiTrashClassifier = GeminiTrashClassifier;
}
