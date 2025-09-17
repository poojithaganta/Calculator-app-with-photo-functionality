import './styles.css';
import { UIController } from './ui.js';

/**
 * Main application entry point
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize the UI controller
        const uiController = new UIController();
        
        // Make it available globally for debugging (optional)
        window.calculatorApp = {
            uiController,
            calculator: uiController.getCalculator(),
            ocrProcessor: uiController.getOCRProcessor()
        };
        
        console.log('Image-Recognition Calculator initialized successfully!');
        
    } catch (error) {
        console.error('Failed to initialize calculator app:', error);
        
        // Show user-friendly error message
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div class="text-center py-12">
                    <h1 class="text-2xl font-bold text-red-600 mb-4">Initialization Error</h1>
                    <p class="text-gray-600 mb-4">Failed to load the calculator application.</p>
                    <button onclick="location.reload()" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                        Reload Page
                    </button>
                </div>
            `;
        }
    }
});

