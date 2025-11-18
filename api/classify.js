// Vercel Serverless Function for Gemini API
// This keeps your API key secure on the server side

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('GEMINI_API_KEY environment variable not set');
        return res.status(500).json({
            error: 'Server configuration error',
            message: 'API key not configured on server'
        });
    }

    try {
        const { contents, generationConfig } = req.body;

        if (!contents) {
            return res.status(400).json({
                error: 'Bad request',
                message: 'Missing contents in request body'
            });
        }

        // Call Gemini API
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents,
                generationConfig: generationConfig || {
                    temperature: 0.4,
                    topK: 32,
                    topP: 1,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API error:', errorData);
            return res.status(response.status).json({
                error: 'Gemini API error',
                message: errorData.error?.message || 'Unknown error',
                details: errorData
            });
        }

        const data = await response.json();

        // Return successful response
        return res.status(200).json(data);

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
