import { sanitizeExpression, normalizeForDisplay } from './utils/sanitize.js';

/**
 * OCR Module - Handles image upload and Google Cloud Vision integration
 */
export class OCRProcessor {
    constructor() {
        this.ocrHistory = [];
        this.maxHistorySize = 3;
        this.isProcessing = false;
    }

    /**
     * Handle image file selection
     * @param {File} file - Selected image file
     * @returns {Promise<string>} - Object URL for preview
     */
    async handleImageSelect(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error('Please select a valid image file');
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Image file size must be less than 5MB');
        }

        // Create preview URL
        const objectUrl = URL.createObjectURL(file);
        return objectUrl;
    }

    /**
     * Process image through OCR API
     * @param {File} file - Image file to process
     * @returns {Promise<Object>} - OCR result with expression
     */
    async processImage(file) {
        if (this.isProcessing) {
            throw new Error('OCR already in progress');
        }

        this.isProcessing = true;

        try {
            // Create FormData for multipart upload
            const formData = new FormData();
            formData.append('image', file);

            // Call OCR API
            const response = await fetch('/api/ocr', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (!result.expression) {
                throw new Error('No mathematical expression found in the image');
            }

            // Sanitize the expression
            const sanitized = sanitizeExpression(result.expression);
            
            if (!sanitized) {
                throw new Error('Could not extract a valid mathematical expression');
            }

            // Add to history
            this.addToHistory(sanitized);

            return {
                expression: sanitized,
                displayExpression: normalizeForDisplay(sanitized)
            };

        } catch (error) {
            throw new Error(`Failed to process with Google Cloud Vision: ${error.message}`);
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Add expression to history
     * @param {string} expression - Sanitized expression
     * @param {string} result - Optional result to display
     */
    addToHistory(expression, result = null) {
        // Create history entry with expression and result
        const historyEntry = {
            expression: expression,
            result: result,
            timestamp: new Date().toISOString()
        };
        
        // Remove if already exists (compare by expression)
        this.ocrHistory = this.ocrHistory.filter(entry => entry.expression !== expression);
        
        // Add to beginning
        this.ocrHistory.unshift(historyEntry);
        
        // Keep only last 3
        if (this.ocrHistory.length > this.maxHistorySize) {
            this.ocrHistory = this.ocrHistory.slice(0, this.maxHistorySize);
        }
    }

    /**
     * Get OCR history
     * @returns {Array<Object>} - Array of recent history entries
     */
    getHistory() {
        return [...this.ocrHistory];
    }

    /**
     * Get OCR history expressions only (for backward compatibility)
     * @returns {Array<string>} - Array of recent expressions
     */
    getHistoryExpressions() {
        return this.ocrHistory.map(entry => entry.expression);
    }

    /**
     * Clear OCR history
     */
    clearHistory() {
        this.ocrHistory = [];
    }

    /**
     * Check if OCR is currently processing
     * @returns {boolean} - True if processing
     */
    isCurrentlyProcessing() {
        return this.isProcessing;
    }
}

/**
 * UI Helper functions for OCR
 */
export class OCRUI {
    constructor(ocrProcessor) {
        this.ocrProcessor = ocrProcessor;
        this.currentImageFile = null;
        this.currentPreviewUrl = null;
    }

    /**
     * Show image preview section
     * @param {string} previewUrl - Object URL for preview
     * @param {File} file - Image file
     */
    showImagePreview(previewUrl, file) {
        this.currentImageFile = file;
        this.currentPreviewUrl = previewUrl;

        const imageSection = document.getElementById('imageSection');
        const imagePreview = document.getElementById('imagePreview');
        const solveButton = document.getElementById('solveFromImage');

        imagePreview.src = previewUrl;
        imageSection.classList.remove('hidden');
        
        // Enable solve button
        solveButton.disabled = false;
        solveButton.textContent = 'Solve from Image';
    }

    /**
     * Hide image preview section
     */
    hideImagePreview() {
        const imageSection = document.getElementById('imageSection');
        imageSection.classList.add('hidden');

        // Clean up
        if (this.currentPreviewUrl) {
            URL.revokeObjectURL(this.currentPreviewUrl);
            this.currentPreviewUrl = null;
        }
        this.currentImageFile = null;
    }

    /**
     * Show loading state
     */
    showLoading() {
        const loadingSpinner = document.getElementById('loadingSpinner');
        const solveButton = document.getElementById('solveFromImage');
        const ocrStatus = document.getElementById('ocrStatus');

        loadingSpinner.classList.remove('hidden');
        solveButton.disabled = true;
        solveButton.textContent = 'Processing...';
        
        ocrStatus.classList.remove('hidden');
        ocrStatus.textContent = 'Reading expression from image...';
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingSpinner = document.getElementById('loadingSpinner');
        const solveButton = document.getElementById('solveFromImage');
        const ocrStatus = document.getElementById('ocrStatus');

        loadingSpinner.classList.add('hidden');
        solveButton.disabled = false;
        solveButton.textContent = 'Solve from Image';
        ocrStatus.classList.add('hidden');
    }

    /**
     * Show OCR result
     * @param {string} expression - Sanitized expression
     * @param {string} displayExpression - Expression for display
     */
    showOCRResult(expression, displayExpression) {
        const ocrStatus = document.getElementById('ocrStatus');
        ocrStatus.classList.remove('hidden');
        ocrStatus.textContent = `Found: ${displayExpression}`;
        ocrStatus.className = 'mt-2 text-sm text-green-600';
    }

    /**
     * Show OCR error
     * @param {string} error - Error message
     */
    showOCRError(error) {
        const ocrStatus = document.getElementById('ocrStatus');
        ocrStatus.classList.remove('hidden');
        ocrStatus.textContent = `Error: ${error}`;
        ocrStatus.className = 'mt-2 text-sm text-red-600';
    }

    /**
     * Update OCR history display
     */
    updateHistoryDisplay() {
        const historySection = document.getElementById('ocrHistory');
        const historyList = document.getElementById('historyList');
        const history = this.ocrProcessor.getHistory();

        if (history.length === 0) {
            historySection.classList.add('hidden');
            return;
        }

        historySection.classList.remove('hidden');
        historyList.innerHTML = '';

        history.forEach((entry, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors';
            
            const displayExpr = normalizeForDisplay(entry.expression);
            const resultDisplay = entry.result ? ` = ${entry.result}` : '';
            
            historyItem.innerHTML = `
                <div class="flex flex-col">
                    <span class="text-gray-700 font-mono">${displayExpr}${resultDisplay}</span>
                </div>
                <button class="text-blue-500 hover:text-blue-700 text-sm" data-history-index="${index}">
                    Use
                </button>
            `;
            
            historyList.appendChild(historyItem);
        });
    }

    /**
     * Get current image file
     * @returns {File|null} - Current image file or null
     */
    getCurrentImageFile() {
        return this.currentImageFile;
    }
}
