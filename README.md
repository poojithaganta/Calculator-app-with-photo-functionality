# Image-Recognition Calculator 

A modern, feature-rich calculator web application that can read mathematical expressions from images using Google Cloud Vision API. Built with vanilla JavaScript, Tailwind CSS, and a Node.js backend.

##  Features

###  Core Calculator
- **Full-featured calculator** with all basic operations (+, -, ×, ÷)
- **Advanced functions**: percentage, sign toggle, decimal support
- **Smart state management** with proper edge case handling
- **Keyboard support** for all operations
- **Responsive design** that works on all devices

###  Image Recognition
- **Upload images** containing mathematical expressions
- **OCR processing** using Google Cloud Vision API
- **Smart sanitization** of extracted expressions
- **Preview functionality** before processing
- **History tracking** of recent OCR expressions

###  Security & Safety
- **No eval() usage** - safe math evaluation with mathjs
- **Input sanitization** on both client and server
- **File validation** (type, size, content)
- **API key protection** - never exposed to client

###  Modern UI/UX
- **Clean, intuitive interface** with Tailwind CSS
- **Smooth animations** and transitions
- **Toast notifications** for user feedback
- **Loading states** and error handling
- **Accessibility features** (ARIA, keyboard navigation)

##  Tech Stack

### Frontend
- **Vanilla JavaScript** (ES6+) - No frameworks, pure performance
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Math.js** - Safe mathematical expression evaluation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Multer** - File upload handling
- **Google Cloud Vision** - Image to Text OCR API

## Prerequisites

- **Node.js** 18+ and npm
- **Google Cloud Platform account** with Vision API enabled
- **Service Account** with Vision API permissions


### Google Cloud Vision Setup

#### Enable Vision API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Vision API** in the API Library
4. Go to **IAM & Admin** → **Service Accounts**
5. Create a new service account with **Cloud Vision API User** role
6. Download the JSON key file


### Start the Application

#### Option A: Run Both Services (Recommended)
```bash
npm run start
```

#### Option B: Run Separately (Two Terminal Windows)
```bash
# Terminal 1 - Backend Server
npm run server

# Terminal 2 - Frontend Dev Server
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8787
- **Health Check**: http://localhost:8787/api/health

##  Usage Guide

### Basic Calculator Operations
1. **Click buttons** or use **keyboard** for calculations
2. **Supported keys**: 0-9, +, -, *, /, Enter (=), Escape (AC), Backspace
3. **Chaining operations**: 5 + 3 × 2 = 16 (follows order of operations)

### Image Recognition
1. **Click the camera icon** to upload an image
2. **Select an image** containing a math expression
3. **Review the preview** and click "Solve from Image"
4. **Wait for processing** (Google Cloud Vision API call)
5. **View the result** and extracted expression

### Supported Image Types
- **Formats**: PNG, JPEG, JPG
- **Size limit**: 5MB maximum (Google Cloud Vision: up to 20MB)
- **Content**: Clear mathematical expressions


##  API Documentation

### Endpoints

#### `GET /api/health`
Health check endpoint
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "vision": "google-cloud"
}
```

#### `POST /api/ocr`
Process image for mathematical expression
```json
// Request: multipart/form-data
{
  "image": "file"
}

// Response
{
  "success": true,
  "expression": "2+3*4",
  "filename": "math.png",
  "processedAt": "2024-01-01T00:00:00.000Z"
}
```

---


