let operator;
let a; // 1st operand;
let b; // 2nd operand;
let operandSwitch; // Defines when to clear the display for a new number
let decimalPoint;
let miniDisplay = [];

// Module for DOM Elements
const DOM = (() => {
    const display = () => document.querySelector('.display');
    const operation = () => document.querySelector('.operation');
    const button = (key) => document.querySelector(`button[data-key="${key}"]`);

    const addListener = (type, selector, callback) => {
        if (typeof selector === 'object') {
            document.addEventListener(type, (e) => callback(e));
            return;
        }
        document.addEventListener(type, (e) => {
            if (e.target.closest(selector)) callback(e);
        });
    };

    return { display, operation, button, addListener };
})();

function calculate(sign, x, y) {
    add = (x, y) => x + y;
    sub = (x, y) => x - y;
    mul = (x, y) => x * y;
    div = (x, y) => x / y;

    switch (sign) {
        case 'add':
            return this.add(x, y);
        case 'subtract':
            return this.sub(x, y);
        case 'multiply':
            return this.mul(x, y);
        case 'divide':
            return this.div(x, y);
        default:
            break;
    }
}

function resetValues() {
    operator = undefined;
    a = undefined;
    b = undefined;
    operandSwitch = undefined;
    decimalPoint = undefined;
}

// Module for Display Changes
const DisplayController = (() => {
    function handleNumber(display, currentInput) {
        // Clear the display and start a new operation
        // if the last button pressed was 'equals'
        if (b !== undefined) {
            resetValues();
            if (currentInput === 'point') {
                display.innerText = '0';
            } else {
                display.innerText = '';
            }
        }
        // Clear the display when typing the second operand
        // or just starting a new operation
        else if (operandSwitch || display.innerText === '0') {
            if (currentInput === 'point') {
                display.innerText = '0';
            } else {
                display.innerText = '';
            }
        }
        // Prevent more than one decimal point
        if (currentInput === 'point') {
            if (decimalPoint) {
                return;
            } else {
                currentInput = '.';
                decimalPoint = true;
            }
        }
        operandSwitch = false;
        display.innerText += currentInput;
    }

    function handleOperator(display, input, result) {
        // Change operation without affecting the current operand
        if (operator !== undefined && operandSwitch) {
            b = undefined;
        }
        // Chain operations with the operator acting as an 'equals' button
        else if (a !== undefined) {
            b = parseFloat(display.innerText);
            if (operator === 'divide' && b === 0) {
                window.alert("We don't do that here");
                operandSwitch = true;
                return;
            }

            result = Math.round(calculate(operator, a, b) * 1e9) / 1e9;
            display.innerText = result;
            a = result;
            b = undefined;
        }
        // Simple operation with only two operands
        else {
            a = parseFloat(display.innerText);
        }
        operator = input.id;
        operandSwitch = true;
        decimalPoint = false;
    }

    function handleEquals(display, result) {
        if (b === undefined || !operandSwitch) {
            b = parseFloat(display.innerText);
            if (operator === 'divide' && b === 0) {
                window.alert("We don't do that here");
                operandSwitch = true;
                return;
            }
        }
        result = Math.round(calculate(operator, a, b) * 1e9) / 1e9;
        display.innerText = result;
        a = result;
        operandSwitch = true;
    }

    return { handleNumber, handleOperator, handleEquals };
})();

function updateDisplay(input) {
    const display = DOM.display();
    let result = 0;

    // Update Main Display
    if (input.classList.contains('operator')) {
        DisplayController.handleOperator(display, input, result);
    } else if (input.classList.contains('equals')) {
        DisplayController.handleEquals(display, result);
    } else if (input.classList.contains('clear')) {
        display.innerText = '0';
        resetValues();
    } else {
        let currentInput = input.id;
        DisplayController.handleNumber(display, currentInput);
    }

    // Update Mini Display
    if (!operandSwitch && operator === undefined) {
        miniDisplay[0] = display.innerText;
    } else {
        miniDisplay[0] = a.toString();
        miniDisplay[2] = '';
    }
    if (input.classList.contains('operator')) {
        miniDisplay[1] = input.innerText;
    }
    if (a !== undefined && !operandSwitch) {
        miniDisplay[2] = display.innerText;
    }
    DOM.operation().innerText = miniDisplay.join(' ');
}

// Handle Button Clicks
DOM.addListener('click', '.btn', (e) => {
    updateDisplay(e.target);
});

// Handle Button Key Presses
DOM.addListener('keydown', window, (event) => {
    let key = event.key.toLowerCase();
    if (key === '/') {
        event.preventDefault();
    } else if (key === 'enter') {
        event.preventDefault();
        if (a === undefined) return;
    } else if (key === ',') {
        key = '.';
    } else if (key === 'escape') {
        key = 'c';
    }

    const input = DOM.button(key);
    if (input) {
        // Change button color on key press
        if (input.classList.contains('equals')) {
            input.classList.add('equals-selected');
        } else if (input.classList.contains('function')) {
            input.classList.add('function-selected');
        } else {
            input.classList.add('btn-selected');
        }
    }

    try {
        updateDisplay(input);
    } catch (error) {}
});

DOM.addListener('keyup', window, (event) => {
    // Revert to the button's original color
    const input = DOM.button(event.key);
    if (input) {
        if (input.classList.contains('equals')) {
            input.classList.remove('equals-selected');
        } else if (input.classList.contains('function')) {
            input.classList.remove('function-selected');
        } else {
            input.classList.remove('btn-selected');
        }
    }
});
