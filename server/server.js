import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// Debug environment variables
console.log('Environment variables after dotenv.config():');
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Current working directory:', process.cwd());

import { upload, handleMulterError } from './middleware/upload.js';
import { extractExpression, makeClient } from './gcpvision.js';

const app = express();
const PORT = process.env.PORT || 8787;

// Initialize Google Cloud Vision client
let visionClient;
try {
    visionClient = makeClient();
    console.log('Google Cloud Vision client initialized');
} catch (error) {
    console.error('Failed to initialize Google Cloud Vision client:', error.message);
    console.error('Please check your Google Cloud credentials configuration');
    process.exit(1);
}

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? false 
        : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        vision: 'google-cloud'
    });
});

// OCR endpoint for processing images
app.post('/api/ocr', upload.single('image'), handleMulterError, async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                error: 'No image file provided'
            });
        }

        const { buffer, mimetype, originalname } = req.file;

        // Validate file size
        if (buffer.length > 5 * 1024 * 1024) {
            return res.status(400).json({
                error: 'File size exceeds 5MB limit'
            });
        }

        // Validate MIME type
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedMimeTypes.includes(mimetype)) {
            return res.status(400).json({
                error: 'Invalid file type. Only PNG, JPEG, and JPG images are allowed.'
            });
        }

        console.log(`Processing image: ${originalname} (${mimetype}, ${buffer.length} bytes)`);

        // Process image with Google Cloud Vision API
        const expression = await extractExpression(buffer, mimetype);

        if (!expression) {
            return res.status(400).json({
                error: 'No mathematical expression found in the image'
            });
        }

        console.log(`Extracted expression: ${expression}`);

        // Return the extracted expression
        res.json({
            success: true,
            expression: expression,
            filename: originalname,
            processedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Google Cloud Vision processing error:', error);
        
        res.status(500).json({
            error: error.message || 'Failed to process image with Google Cloud Vision'
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        availableEndpoints: [
            'GET /api/health',
            'POST /api/ocr'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Calculator server running on port ${PORT}`);
    console.log(`Frontend should be running on http://localhost:5173`);
    console.log(`Google Cloud Vision: ${visionClient ? 'Configured' : 'Not configured'}`);
    
    if (process.env.NODE_ENV === 'development') {
        console.log(`CORS enabled for development`);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n Shutting down server gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n Server terminated');
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
