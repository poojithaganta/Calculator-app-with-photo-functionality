# Image-Recognition Calculator 

A modern, feature-rich calculator web application that can read mathematical expressions from images using Google Cloud Vision API. Built with vanilla JavaScript, Tailwind CSS, and a Node.js backend.

![Calculator Demo](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Calculator+Demo+GIF+Placeholder)

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

> **Note**: Google Cloud Vision API pricing:
> - First 1,000 requests per month are free
> - $1.50 per 1,000 requests after that
> - No file size restrictions for most use cases

##  Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd image-recognition-calculator
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Google Cloud Vision Setup

#### Enable Vision API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Vision API** in the API Library
4. Go to **IAM & Admin** → **Service Accounts**
5. Create a new service account with **Cloud Vision API User** role
6. Download the JSON key file

#### Configure Environment
```bash
# Copy environment template
cp server/env.example server/.env

# Place your service account JSON file in the server directory
# Rename it to service-account.json

# Edit server/.env and configure your credentials
GOOGLE_APPLICATION_CREDENTIALS=./server/service-account.json
```

### 4. Start the Application

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

### 5. Access the Application
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

##  Testing

### Manual Test Cases
```javascript
// Basic Operations
2 + 3 = 5
10 - 4 = 6
6 × 7 = 42
20 ÷ 5 = 4

// Edge Cases
0 ÷ 0 = "Cannot divide by zero"
999999999999 + 1 = 1e+12 (scientific notation)
0.1 + 0.2 = 0.3 (no floating point issues)

// Complex Expressions
(2 + 3) × 4 = 20
10 % = 0.1
-5 × -3 = 15
```

### API Testing
```bash
# Health check
curl http://localhost:8787/api/health

# Test OCR endpoint (replace with actual image file)
curl -X POST -F "image=@test-image.png" http://localhost:8787/api/ocr
```

##  Configuration

### Environment Variables
```bash
# Required - Google Cloud Vision credentials
GOOGLE_APPLICATION_CREDENTIALS=./server/service-account.json
# OR
GCP_SERVICE_ACCOUNT_JSON=./server/service-account.json

# Optional
PORT=8787
NODE_ENV=development
MAX_FILE_SIZE=5242880
```

### Tailwind Configuration
- **Custom animations** for calculator interactions
- **Responsive breakpoints** for mobile/desktop
- **Color scheme** with orange accent for operators

##  Responsive Design

- **Mobile-first** approach
- **Touch-friendly** button sizes
- **Adaptive layouts** for different screen sizes
- **Keyboard navigation** support

##  Error Handling

### Frontend Errors
- **Input validation** with user-friendly messages
- **Network error** handling for API calls
- **Graceful degradation** when features fail

### Backend Errors
- **File validation** (type, size, content)
- **API error** handling and logging
- **Rate limiting** considerations
- **Security validation** for all inputs

##  Security Features

- **Input sanitization** using whitelist approach
- **File type validation** on both client and server
- **Size limits** to prevent abuse
- **CORS configuration** for development
- **Environment variable** protection

##  Performance Optimizations

- **Lazy loading** of heavy components
- **Efficient state management** with minimal re-renders
- **Optimized image processing** with size limits
- **Memory management** for file uploads

##  Troubleshooting

### Common Issues

#### "Google Cloud Vision credentials not configured"
```bash
# Check your .env file
cat server/.env

# Ensure the credentials are set correctly
GOOGLE_APPLICATION_CREDENTIALS=./server/service-account.json

# Verify the service account JSON file exists
ls -la server/service-account.json
```

#### "CORS error in browser"
```bash
# Check if backend is running
curl http://localhost:8787/api/health

# Verify ports match in vite.config.js
```

#### "Image upload fails"
- Check file size (max 5MB)
- Ensure file type is PNG/JPEG/JPG
- Verify backend server is running

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development npm run server

# Check browser console for frontend errors
# Check terminal for backend errors
```

##  Future Enhancements

- **Scientific calculator** functions
- **Expression history** with persistent storage
- **Multiple image formats** support
- **Batch processing** of multiple images
- **Export results** to PDF/CSV
- **User accounts** and saved calculations
- **Real-time collaboration** features

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

##  Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- **Google Cloud Vision** for image recognition capabilities
- **Math.js** for safe mathematical evaluation
- **Tailwind CSS** for the beautiful UI framework
- **Vite** for the fast development experience

##  Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/image-recognition-calculator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/image-recognition-calculator/discussions)
- **Email**: your.email@example.com

---


