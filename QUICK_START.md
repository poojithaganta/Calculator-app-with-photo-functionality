# 🚀 Quick Start Guide

## ⚡ Get Running in 5 Minutes

### 1. Setup Environment
```bash
# Copy environment template
cp server/env.example server/.env

# Place your Google Cloud service account JSON file in server directory
# Rename it to service-account.json

# Edit server/.env and configure your credentials
GOOGLE_APPLICATION_CREDENTIALS=./server/service-account.json
```

### 2. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server && npm install && cd ..
```

**Note**: If you get an error about missing `package.json` in the server directory, the server package.json has been created for you with all necessary dependencies.

### 3. Start the App
```bash
# Use the start script (recommended)
./start.sh

# OR start manually
npm run start
```

### 4. Open in Browser
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8787

## What You Get

✅ **Full Calculator** - All basic operations with keyboard support  
✅ **Image Recognition** - Upload math expressions from images  
✅ **Modern UI** - Clean, responsive design with Tailwind CSS  
✅ **Secure** - No eval(), proper input validation  
✅ **Mobile Ready** - Works on all devices  

## Test It

1. **Calculator**: Try `2 + 3 = 5`
2. **Image OCR**: Upload a photo with "25 + 17"
3. **Keyboard**: Use number keys, +, -, *, /, Enter

## Get Google Cloud Vision Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Vision API in your project
3. Create a service account with Vision API permissions
4. Download the JSON key file and save as `server/service-account.json`
5. Set `GOOGLE_APPLICATION_CREDENTIALS=./server/service-account.json` in `server/.env`

---

**That's it!**
