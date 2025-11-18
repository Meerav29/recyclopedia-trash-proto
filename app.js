// Camera and UI elements
const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const captureBtnText = document.getElementById('captureBtnText');
const captureOverlay = document.getElementById('captureOverlay');
const videoContainer = document.getElementById('videoContainer');
const previewContainer = document.getElementById('previewContainer');
const capturedImage = document.getElementById('capturedImage');
const retakeBtn = document.getElementById('retakeBtn');
const resultsSection = document.getElementById('resultsSection');
const closeResultsBtn = document.getElementById('closeResultsBtn');
const scanAgainBtn = document.getElementById('scanAgainBtn');

// Result elements
const itemName = document.getElementById('itemName');
const confidenceScore = document.getElementById('confidenceScore');
const binType = document.getElementById('binType');
const binDescription = document.getElementById('binDescription');
const binIcon = document.getElementById('binIcon');

let stream = null;
let isCameraActive = false;
let isProcessing = false;

// Initialize Gemini API classifier
let geminiClassifier = null;

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // Use serverless mode (true) to keep API key secure on server
    // Set to false only for local development with direct API calls
    const useServerless = true;

    geminiClassifier = new GeminiTrashClassifier(null, useServerless);

    if (geminiClassifier.isConfigured()) {
        console.log('✅ Gemini API initialized successfully (serverless mode)');
    } else {
        console.warn('⚠️ API configuration issue');
    }
});

// Show warning if API key is not configured
function showApiKeyWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #FF9800;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        font-weight: 600;
    `;
    warningDiv.textContent = '⚠️ Please configure your Gemini API key in config.js';
    document.body.appendChild(warningDiv);

    setTimeout(() => warningDiv.remove(), 5000);
}

// Bin categories configuration
const binCategories = {
    recycling: {
        name: 'Recycling Bin',
        description: 'This item can be recycled. Please rinse before disposing.',
        color: '#4CAF50',
        icon: '♻️'
    },
    plastic: {
        name: 'Plastic Recycling',
        description: 'Recyclable plastic. Check for recycling symbols.',
        color: '#2196F3',
        icon: '🔵'
    },
    landfill: {
        name: 'Landfill',
        description: 'This item should go to landfill waste.',
        color: '#757575',
        icon: '🗑️'
    },
    compost: {
        name: 'Compost Bin',
        description: 'Organic waste. Can be composted.',
        color: '#8D6E63',
        icon: '🌱'
    },
    hazardous: {
        name: 'Hazardous Waste',
        description: 'Special disposal required. Take to hazardous waste facility.',
        color: '#F44336',
        icon: '⚠️'
    },
    paper: {
        name: 'Paper Recycling',
        description: 'Recyclable paper products.',
        color: '#FF9800',
        icon: '📄'
    },
    glass: {
        name: 'Glass Recycling',
        description: 'Recyclable glass. Remove caps and lids.',
        color: '#00BCD4',
        icon: '🫙'
    },
    metal: {
        name: 'Metal Recycling',
        description: 'Recyclable metal. Aluminum and steel cans.',
        color: '#9E9E9E',
        icon: '🔘'
    }
};

// Initialize camera
async function initCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // Use back camera on mobile
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        });
        video.srcObject = stream;
        isCameraActive = true;
        videoContainer.style.display = 'block';
        captureBtnText.textContent = 'Capture Image';
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please ensure you have granted camera permissions.');
    }
}

// Stop camera
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        stream = null;
        isCameraActive = false;
    }
}

// Capture image from video
function captureImage() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    return imageDataUrl;
}

// Detect if image contains trash using Gemini API
async function detectTrash(imageDataUrl) {
    if (geminiClassifier && geminiClassifier.isConfigured()) {
        try {
            return await geminiClassifier.detectTrash(imageDataUrl);
        } catch (error) {
            console.error('Gemini API error:', error);
            alert('Error detecting trash: ' + error.message);
            throw error;
        }
    } else {
        // Fallback to mock detection if API not configured
        console.warn('Using mock detection - Gemini API not configured');
        return new Promise((resolve) => {
            setTimeout(() => {
                const hasTrash = Math.random() > 0.2;
                resolve(hasTrash);
            }, 1000);
        });
    }
}

// Classify trash using Gemini API
async function classifyTrash(imageDataUrl) {
    if (geminiClassifier && geminiClassifier.isConfigured()) {
        try {
            const result = await geminiClassifier.classifyTrash(imageDataUrl);
            return result;
        } catch (error) {
            console.error('Gemini API error:', error);
            alert('Error classifying trash: ' + error.message);
            throw error;
        }
    } else {
        // Fallback to mock classification if API not configured
        console.warn('Using mock classification - Gemini API not configured');
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockResults = [
                    { item: 'Plastic Bottle', category: 'plastic', confidence: 0.95, instructions: 'Remove cap and rinse before recycling', recyclable: true },
                    { item: 'Aluminum Can', category: 'metal', confidence: 0.92, instructions: 'Rinse and crush to save space', recyclable: true },
                    { item: 'Paper Cup', category: 'paper', confidence: 0.88, instructions: 'Check if it has a plastic lining', recyclable: true },
                    { item: 'Glass Bottle', category: 'glass', confidence: 0.91, instructions: 'Remove caps and rinse', recyclable: true },
                    { item: 'Food Waste', category: 'compost', confidence: 0.87, instructions: 'Add to compost bin', recyclable: false },
                    { item: 'Plastic Bag', category: 'landfill', confidence: 0.85, instructions: 'Not recyclable in most areas', recyclable: false },
                    { item: 'Battery', category: 'hazardous', confidence: 0.93, instructions: 'Take to hazardous waste facility', recyclable: false }
                ];
                const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
                resolve(randomResult);
            }, 1500);
        });
    }
}

// Display classification results
function displayResults(result) {
    const category = binCategories[result.category];

    itemName.textContent = result.item;
    confidenceScore.textContent = `${Math.round(result.confidence * 100)}%`;
    binType.textContent = category.name;

    // Use custom instructions from Gemini if available, otherwise use default
    if (result.instructions) {
        binDescription.textContent = result.instructions;
    } else {
        binDescription.textContent = category.description;
    }

    // Update bin icon color
    binIcon.style.color = category.color;

    // Show relevant category tags
    document.querySelectorAll('.category-tags .tag').forEach(tag => {
        tag.style.display = 'none';
    });

    const categoryTag = document.querySelector(`.tag-${result.category}`);
    if (categoryTag) {
        categoryTag.style.display = 'inline-block';
    }

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Main capture and process function
async function handleCapture() {
    if (!isCameraActive) {
        await initCamera();
        return;
    }

    if (isProcessing) {
        return;
    }

    isProcessing = true;
    captureOverlay.style.display = 'flex';
    captureBtnText.textContent = 'Processing...';

    try {
        // Capture the image
        const imageDataUrl = captureImage();

        // Detect if there's trash in the image
        const hasTrash = await detectTrash(imageDataUrl);

        if (!hasTrash) {
            alert('No trash detected in the image. Please try again with a clearer view of the item.');
            captureOverlay.style.display = 'none';
            captureBtnText.textContent = 'Capture Image';
            isProcessing = false;
            return;
        }

        // Show captured image
        capturedImage.src = imageDataUrl;
        videoContainer.style.display = 'none';
        previewContainer.style.display = 'block';
        captureOverlay.style.display = 'none';

        // Classify the trash
        const result = await classifyTrash(imageDataUrl);

        // Display results
        displayResults(result);

        // Stop camera
        stopCamera();

        captureBtnText.textContent = 'Scan Trash';
        isProcessing = false;

    } catch (error) {
        console.error('Error processing image:', error);
        alert('Error processing image. Please try again.');
        captureOverlay.style.display = 'none';
        captureBtnText.textContent = 'Capture Image';
        isProcessing = false;
    }
}

// Retake photo
function handleRetake() {
    previewContainer.style.display = 'none';
    resultsSection.style.display = 'none';
    initCamera();
}

// Close results and restart
function handleCloseResults() {
    resultsSection.style.display = 'none';
    previewContainer.style.display = 'none';
    videoContainer.style.display = 'none';
    stopCamera();
    captureBtnText.textContent = 'Scan Trash';
}

// Scan again
function handleScanAgain() {
    resultsSection.style.display = 'none';
    previewContainer.style.display = 'none';
    initCamera();
}

// Event listeners
captureBtn.addEventListener('click', handleCapture);
retakeBtn.addEventListener('click', handleRetake);
closeResultsBtn.addEventListener('click', handleCloseResults);
scanAgainBtn.addEventListener('click', handleScanAgain);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopCamera();
});

// API Integration Guide (for future implementation)
/*
To integrate with your ML model:

1. Cloud-based API (Vercel/AWS/GCP):

async function classifyTrash(imageDataUrl) {
    const response = await fetch('/api/classify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageDataUrl })
    });

    const result = await response.json();
    return result;
}

2. TensorFlow.js (Client-side):

import * as tf from '@tensorflow/tfjs';

let model;

async function loadModel() {
    model = await tf.loadLayersModel('/models/trash-classifier/model.json');
}

async function classifyTrash(imageDataUrl) {
    const img = new Image();
    img.src = imageDataUrl;
    await img.decode();

    const tensor = tf.browser.fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(255.0)
        .expandDims();

    const predictions = await model.predict(tensor);
    const result = predictions.dataSync();

    // Process predictions
    return {
        item: getItemName(result),
        category: getCategory(result),
        confidence: Math.max(...result)
    };
}

3. For Kaggle dataset integration:
   - Train your model using datasets like:
     * TACO (Trash Annotations in Context)
     * TrashNet Dataset
     * Waste Classification Dataset
   - Export as TensorFlow.js format or deploy to cloud
*/
