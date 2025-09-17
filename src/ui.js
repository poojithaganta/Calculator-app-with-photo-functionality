import { Calculator } from './calculator.js';
import { OCRProcessor, OCRUI } from './ocr.js';
import { showToast } from './utils/toast.js';

/**
 * UI Controller - Manages all DOM interactions and event handling
 */
export class UIController {
    constructor() {
        this.calculator = new Calculator();
        this.ocrProcessor = new OCRProcessor();
        this.ocrUI = new OCRUI(this.ocrProcessor);
        
        this.initializeEventListeners();
        this.updateDisplay();
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Calculator button clicks
        this.setupCalculatorButtons();
        
        // Image upload
        this.setupImageUpload();
        
        // Keyboard support
        this.setupKeyboardSupport();
        
        // OCR solve button
        this.setupOCRSolve();
        
        // Remove image button
        this.setupRemoveImage();
        
        // History item clicks
        this.setupHistoryClicks();
    }

    /**
     * Setup calculator button event listeners
     */
    setupCalculatorButtons() {
        document.addEventListener('click', (e) => {
            if (!e.target.matches('.calc-btn')) return;

            const action = e.target.dataset.action;
            const digit = e.target.dataset.digit;
            const operator = e.target.dataset.operator;

            try {
                switch (action) {
                    case 'digit':
                        this.calculator.inputDigit(digit);
                        break;
                    case 'dot':
                        this.calculator.inputDot();
                        break;
                    case 'operator':
                        this.calculator.setOperator(operator);
                        break;
                    case 'equals':
                        this.calculator.compute();
                        // Add completed calculation to OCR history
                        const completedExpression = this.calculator.getExpression();
                        const result = this.calculator.getCurrentDisplay();
                        if (completedExpression) {
                            this.ocrProcessor.addToHistory(completedExpression, result);
                            this.ocrUI.updateHistoryDisplay();
                        }
                        break;
                    case 'clear':
                        this.calculator.clearAll();
                        break;
                    case 'toggleSign':
                        this.calculator.toggleSign();
                        break;
                    case 'percent':
                        this.calculator.inputPercent();
                        break;
                }

                this.updateDisplay();
            } catch (error) {
                showToast('Calculator error: ' + error.message, 'error');
            }
        });
    }

    /**
     * Setup image upload functionality
     */
    setupImageUpload() {
        const imageInput = document.getElementById('imageInput');
        
        imageInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const previewUrl = await this.ocrProcessor.handleImageSelect(file);
                this.ocrUI.showImagePreview(previewUrl, file);
            } catch (error) {
                showToast(error.message, 'error');
                // Reset file input
                imageInput.value = '';
            }
        });
    }

    /**
     * Setup OCR solve button
     */
    setupOCRSolve() {
        const solveButton = document.getElementById('solveFromImage');
        
        solveButton.addEventListener('click', async () => {
            const imageFile = this.ocrUI.getCurrentImageFile();
            if (!imageFile) return;

            try {
                this.ocrUI.showLoading();
                
                const result = await this.ocrProcessor.processImage(imageFile);
                
                // Evaluate the expression
                const evaluationResult = this.calculator.evaluateExpression(result.expression);
                
                if (evaluationResult === 'Invalid expression') {
                    throw new Error('Could not evaluate the expression');
                }

                this.ocrUI.showOCRResult(result.expression, result.displayExpression);
                this.updateDisplay();
                this.ocrUI.updateHistoryDisplay();
                
                // Highlight the result briefly
                this.highlightResult();
                
                showToast('Expression solved successfully!', 'success');
                
            } catch (error) {
                this.ocrUI.showOCRError(error.message);
                showToast(error.message, 'error');
            } finally {
                this.ocrUI.hideLoading();
            }
        });
    }

    /**
     * Setup remove image functionality
     */
    setupRemoveImage() {
        const removeButton = document.getElementById('removeImage');
        
        removeButton.addEventListener('click', () => {
            this.ocrUI.hideImagePreview();
            const imageInput = document.getElementById('imageInput');
            imageInput.value = '';
        });
    }

    /**
     * Setup history item clicks
     */
    setupHistoryClicks() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-history-index]')) {
                const index = parseInt(e.target.dataset.historyIndex);
                const history = this.ocrProcessor.getHistory();
                const entry = history[index];
                
                if (entry) {
                    // Evaluate the expression from history
                    const result = this.calculator.evaluateExpression(entry.expression);
                    
                    if (result !== 'Invalid expression') {
                        this.updateDisplay();
                        this.highlightResult();
                        showToast('Expression from history evaluated!', 'success');
                    } else {
                        showToast('Could not evaluate expression from history', 'error');
                    }
                }
            }
        });
    }

    /**
     * Setup keyboard support
     */
    setupKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            // Prevent default behavior for calculator keys
            if (this.isCalculatorKey(e.key)) {
                e.preventDefault();
            }

            try {
                switch (e.key) {
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        this.calculator.inputDigit(e.key);
                        break;
                    case '.':
                        this.calculator.inputDot();
                        break;
                    case '+':
                        this.calculator.setOperator('+');
                        break;
                    case '-':
                        this.calculator.setOperator('-');
                        break;
                    case '*':
                        this.calculator.setOperator('×');
                        break;
                    case '/':
                        this.calculator.setOperator('÷');
                        break;
                    case 'Enter':
                    case '=':
                        this.calculator.compute();
                        // Add completed calculation to OCR history
                        const completedExpression = this.calculator.getExpression();
                        const result = this.calculator.getCurrentDisplay();
                        if (completedExpression) {
                            this.ocrProcessor.addToHistory(completedExpression, result);
                            this.ocrUI.updateHistoryDisplay();
                        }
                        break;
                    case 'Escape':
                        this.calculator.clearAll();
                        break;
                    case 'Backspace':
                        this.calculator.clearEntry();
                        break;
                    case '%':
                        this.calculator.inputPercent();
                        break;
                }

                this.updateDisplay();
            } catch (error) {
                showToast('Calculator error: ' + error.message, 'error');
            }
        });
    }

    /**
     * Check if a key is a calculator key
     * @param {string} key - Keyboard key
     * @returns {boolean} - True if calculator key
     */
    isCalculatorKey(key) {
        const calculatorKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', 'Enter', '=', 'Escape', 'Backspace', '%'];
        return calculatorKeys.includes(key);
    }

    /**
     * Update calculator display
     */
    updateDisplay() {
        const resultElement = document.getElementById('result');
        const expressionElement = document.getElementById('expression');
        
        const currentDisplay = this.calculator.getCurrentDisplay();
        const expression = this.calculator.getExpression();
        const currentExpression = this.calculator.getCurrentExpression();
        
        resultElement.textContent = currentDisplay;
        
        // Show completed expression if available, otherwise show current expression being built
        if (expression) {
            expressionElement.textContent = expression;
        } else if (currentExpression && currentExpression !== currentDisplay) {
            expressionElement.textContent = currentExpression;
        } else {
            expressionElement.textContent = '\u00A0'; // Non-breaking space
        }
    }

    /**
     * Highlight the result briefly
     */
    highlightResult() {
        const resultElement = document.getElementById('result');
        resultElement.classList.add('highlight-animation');
        
        setTimeout(() => {
            resultElement.classList.remove('highlight-animation');
        }, 500);
    }

    /**
     * Get calculator instance
     * @returns {Calculator} - Calculator instance
     */
    getCalculator() {
        return this.calculator;
    }

    /**
     * Get OCR processor instance
     * @returns {OCRProcessor} - OCR processor instance
     */
    getOCRProcessor() {
        return this.ocrProcessor;
    }
}

