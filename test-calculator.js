
// Simple test script for calculator functionality
// Run with: node test-calculator.js

import { Calculator } from './src/calculator.js';

console.log('Testing Calculator Functionality...\n');

const calculator = new Calculator();

// Test basic operations
console.log('=== Basic Operations ===');
calculator.inputDigit('5');
calculator.inputDigit('0');
console.log('Input 50:', calculator.getCurrentDisplay());

calculator.setOperator('+');
calculator.inputDigit('2');
calculator.inputDigit('5');
console.log('Input +25:', calculator.getCurrentDisplay());

calculator.compute();
console.log('Result:', calculator.getCurrentDisplay());
console.log('Expression:', calculator.getExpression());

// Test edge cases
console.log('\n=== Edge Cases ===');
calculator.clearAll();
calculator.inputDigit('1');
calculator.inputDot();
calculator.inputDigit('0');
calculator.inputDigit('0');
console.log('1.00:', calculator.getCurrentDisplay());

calculator.setOperator('÷');
calculator.inputDigit('0');
calculator.compute();
console.log('Divide by zero:', calculator.getCurrentDisplay());

// Test expression evaluation
console.log('\n=== Expression Evaluation ===');
calculator.clearAll();
const result = calculator.evaluateExpression('2+3*4');
console.log('2+3*4 =', result);

console.log('\nCalculator tests completed!');

