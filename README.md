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


## Quick Start (after cloning from GitHub)

1. Clone and enter the project directory
   ```bash
   git clone <your-repo-url>
   cd Calculator-app-with-photo-functionality
   ```

2. Install dependencies for both frontend and backend
   ```bash
   npm run install:all
   ```

3. Create backend environment file
   ```bash
   cp server/env.example server/.env
   ```

4. Add Google Cloud Vision credentials
   - Enable the Vision API and create/download a Service Account JSON key (see setup below)
   - Save the key as: `server/service-account.json`
   - Ensure `server/.env` has:
     ```bash
     GOOGLE_APPLICATION_CREDENTIALS=./server/service-account.json
     PORT=8787
     NODE_ENV=development
     ```

5. Start the app
   - Recommended (runs backend and frontend together):
     ```bash
     npm start
     ```
   - Or run separately in two terminals:
     ```bash
     npm run server   # backend at http://localhost:8787
     npm run dev      # frontend at http://localhost:5173 (may use 5174 if busy)
     ```

6. Access locally
   - Frontend: http://localhost:5173 (or the port printed by Vite)
   - Backend health: http://localhost:8787/api/health

7. Verify
   ```bash
   curl http://localhost:8787/api/health
   ```
   - Open the UI and try the calculator
   - Use the camera icon to upload an image and test OCR

### Troubleshooting
- If port 5173 is in use, Vite will automatically use the next available port (e.g., 5174).
- If OCR fails to initialize, verify the credentials file path and permissions:
  - `server/service-account.json` exists
  - `GOOGLE_APPLICATION_CREDENTIALS` points to that file (absolute path is logged on server start)
- To change backend port, edit `PORT` in `server/.env` and update `vite.config.js` proxy `target` to match.


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

