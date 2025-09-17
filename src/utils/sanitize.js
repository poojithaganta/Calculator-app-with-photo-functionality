/**
 * Sanitizes OCR text to make it safe for mathematical evaluation
 * @param {string} text - Raw OCR text from image
 * @returns {string} - Sanitized mathematical expression or empty string if invalid
 */
export function sanitizeExpression(text) {
    if (!text || typeof text !== 'string') {
        return '';
    }

    // Remove all whitespace
    let sanitized = text.replace(/\s+/g, '');

    // Replace fancy math symbols with standard ASCII
    sanitized = sanitized
        .replace(/×/g, '*')           // Multiplication symbol
        .replace(/÷/g, '/')           // Division symbol
        .replace(/−/g, '-')           // Minus sign
        .replace(/[−–—]/g, '-')      // Various dash types
        .replace(/[×✕✖]/g, '*')      // Various multiplication symbols
        .replace(/[÷∕]/g, '/')        // Various division symbols
        .replace(/[()]/g, (match) => match === '(' ? '(' : ')'); // Parentheses

    // Replace commas with dots for decimal numbers (common in some locales)
    sanitized = sanitized.replace(/,/g, '.');

    // Whitelist allowed characters: digits, operators, parentheses, dots, and single minus
    const allowedPattern = /^[0-9+\-*/().]+$/;
    
    if (!allowedPattern.test(sanitized)) {
        return '';
    }

    // Prevent multiple consecutive operators (except for negative numbers)
    sanitized = sanitized.replace(/([+\-*/]){2,}/g, (match) => {
        // If it's all minus signs, keep only one (for negative numbers)
        if (match.includes('-') && !match.includes('+') && !match.includes('*') && !match.includes('/')) {
            return '-';
        }
        // Otherwise, keep only the first operator
        return match[0];
    });

    // Prevent multiple consecutive dots
    sanitized = sanitized.replace(/\.{2,}/g, '.');

    // Prevent operator at the beginning (except minus for negative numbers)
    if (/^[+*/]/.test(sanitized)) {
        sanitized = sanitized.substring(1);
    }

    // Prevent operator at the end
    if (/[+\-*/]$/.test(sanitized)) {
        sanitized = sanitized.slice(0, -1);
    }

    // Ensure balanced parentheses
    if (!hasBalancedParentheses(sanitized)) {
        return '';
    }

    // Final validation: must contain at least one digit
    if (!/\d/.test(sanitized)) {
        return '';
    }

    return sanitized;
}

/**
 * Checks if parentheses are balanced
 * @param {string} text - Text to check
 * @returns {boolean} - True if parentheses are balanced
 */
function hasBalancedParentheses(text) {
    let count = 0;
    for (let char of text) {
        if (char === '(') count++;
        if (char === ')') count--;
        if (count < 0) return false; // Closing parenthesis before opening
    }
    return count === 0;
}

/**
 * Normalizes the expression for display
 * @param {string} expression - Sanitized expression
 * @returns {string} - Normalized expression for display
 */
export function normalizeForDisplay(expression) {
    if (!expression) return '';
    
    return expression
        .replace(/\*/g, '×')  // Convert * back to × for display
        .replace(/\//g, '÷'); // Convert / back to ÷ for display
}

