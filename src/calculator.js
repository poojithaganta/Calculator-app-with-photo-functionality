import { evaluate } from 'mathjs';

/**
 * Calculator State Machine
 * Handles all calculator operations and state transitions
 */
export class Calculator {
    constructor() {
        this.reset();
    }

    /**
     * Reset calculator to initial state
     */
    reset() {
        this.state = {
            current: '0',
            previous: null,
            operator: null,
            overwrite: false,
            expression: ''
        };
    }

    /**
     * Input a digit (0-9)
     * @param {string} digit - Single digit string
     */
    inputDigit(digit) {
        if (!/^[0-9]$/.test(digit)) {
            throw new Error('Invalid digit');
        }

        if (this.state.overwrite) {
            this.state.current = digit;
            this.state.overwrite = false;
        } else {
            // Prevent numbers longer than 12 digits
            if (this.state.current.length >= 12) {
                return;
            }
            
            if (this.state.current === '0') {
                this.state.current = digit;
            } else {
                this.state.current += digit;
            }
        }
    }

    /**
     * Input a decimal point
     */
    inputDot() {
        if (this.state.overwrite) {
            this.state.current = '0.';
            this.state.overwrite = false;
        } else if (!this.state.current.includes('.')) {
            this.state.current += '.';
        }
    }

    /**
     * Set an operator (+, -, ×, ÷)
     * @param {string} operator - Operator symbol
     */
    setOperator(operator) {
        if (this.state.operator && !this.state.overwrite) {
            // Chain operations: compute previous operation first
            this.compute();
        }

        // Store only the numeric value, not any expression
        this.state.previous = this.state.current;
        this.state.operator = operator;
        this.state.overwrite = true;
        
        // Clear any previous expression and build new one
        this.state.expression = '';
        this.state.expression = `${this.state.previous} ${operator}`;
    }

    /**
     * Toggle sign of current number
     */
    toggleSign() {
        if (this.state.current === '0') return;
        
        if (this.state.current.startsWith('-')) {
            this.state.current = this.state.current.substring(1);
        } else {
            this.state.current = '-' + this.state.current;
        }
    }

    /**
     * Calculate percentage of current number
     */
    inputPercent() {
        const current = parseFloat(this.state.current);
        if (isNaN(current)) return;
        
        this.state.current = (current / 100).toString();
        this.formatNumber();
    }

    /**
     * Clear all calculator state
     */
    clearAll() {
        this.reset();
    }

    /**
     * Clear current entry only
     */
    clearEntry() {
        this.state.current = '0';
        this.state.overwrite = false;
    }

    /**
     * Compute the result of current operation
     */
    compute() {
        if (!this.state.operator || this.state.previous === null) {
            return;
        }

        const prev = parseFloat(this.state.previous);
        const current = parseFloat(this.state.current);
        
        if (isNaN(prev) || isNaN(current)) {
            this.state.current = 'Error';
            return;
        }

        // Store original operands for expression display
        const originalPrev = this.state.previous;
        const originalCurrent = this.state.current;

        let result;
        try {
            switch (this.state.operator) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '×':
                    result = prev * current;
                    break;
                case '÷':
                    if (current === 0) {
                        this.state.current = 'Cannot divide by zero';
                        this.state.operator = null;
                        this.state.previous = null;
                        return;
                    }
                    result = prev / current;
                    break;
                default:
                    this.state.current = 'Error';
                    return;
            }

            this.state.current = result.toString();
            this.formatNumber();
            
            // Update expression for display using original operands
            this.state.expression = `${originalPrev} ${this.state.operator} ${originalCurrent}`;
            
            this.state.operator = null;
            this.state.previous = null;
            this.state.overwrite = true;
        } catch (error) {
            this.state.current = 'Error';
        }
    }

    /**
     * Evaluate a complete mathematical expression
     * @param {string} expression - Mathematical expression string
     * @returns {string} - Result or error message
     */
    evaluateExpression(expression) {
        if (!expression || typeof expression !== 'string') {
            return 'Invalid expression';
        }

        try {
            // Remove equals sign and any trailing spaces if present
            let cleanExpression = expression.replace(/\s*=\s*$/, '').trim();
            
            // Use mathjs for safe evaluation
            const result = evaluate(cleanExpression);
            
            if (!isFinite(result)) {
                return 'Invalid result';
            }

            // Format the result
            let formattedResult = result.toString();
            
            // Handle very large or small numbers
            if (Math.abs(result) >= 1e12 || (Math.abs(result) < 1e-12 && result !== 0)) {
                formattedResult = result.toExponential(6);
            } else {
                // Remove trailing zeros after decimal
                formattedResult = parseFloat(result.toPrecision(12)).toString();
            }

            // Update calculator state
            this.state.current = formattedResult;
            // Ensure expression has only one equals sign
            this.state.expression = expression.endsWith('=') ? expression : `${expression}`;
            this.state.overwrite = true;
            this.state.operator = null;
            this.state.previous = null;

            return formattedResult;
        } catch (error) {
            return 'Invalid expression';
        }
    }

    /**
     * Format current number for display
     */
    formatNumber() {
        const num = parseFloat(this.state.current);
        if (isNaN(num)) return;

        // Handle very large numbers
        if (Math.abs(num) >= 1e12) {
            this.state.current = num.toExponential(6);
            return;
        }

        // Handle very small numbers
        if (Math.abs(num) < 1e-12 && num !== 0) {
            this.state.current = num.toExponential(6);
            return;
        }

        // Remove trailing zeros after decimal
        this.state.current = parseFloat(num.toPrecision(12)).toString();
    }

    /**
     * Get current calculator state
     * @returns {Object} - Current state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Get current display value
     * @returns {string} - Current display value
     */
    getCurrentDisplay() {
        return this.state.current;
    }

    /**
     * Get current expression for display
     * @returns {string} - Current expression
     */
    getExpression() {
        return this.state.expression;
    }

    /**
     * Get the current expression being built (without equals sign)
     * @returns {string} - Current expression being built
     */
    getCurrentExpression() {
        if (this.state.operator && this.state.previous) {
            return `${this.state.previous} ${this.state.operator} ${this.state.current}`;
        }
        return this.state.current;
    }
}

