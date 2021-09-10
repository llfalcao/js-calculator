const buttons = document.querySelectorAll('.btn');
let operator, a, b, operandSwitch, decimalPoint;
// a: 1st operand;
// b: 2nd operand;
// operandSwitch: defines when to clear the display for a new number

buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
        updateDisplay(btn);
    });
});

window.addEventListener('keydown', (event) => {
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
    const input = document.querySelector(`button[data-key="${key}"]`);

    if (input) {
        document.addEventListener(
            'keyup',
            function onKeyup() {
                document.removeEventListener('keyup', onKeyup);
                // Default background color
                if (input.classList.contains('equals')) {
                    input.classList.remove('equals-selected');
                } else if (input.classList.contains('function')) {
                    input.classList.remove('function-selected');
                } else {
                    input.classList.remove('btn-selected');
                }
            },
            false
        );
        // Background color on key press
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

function updateDisplay(input) {
    const display = document.querySelector('.display');
    let result = 0;

    if (input.classList.contains('operator')) {
        // Change operation without affecting the current operand
        if (operator !== undefined && operandSwitch) {
            b = undefined;
        }
        // Chain operations with the operator acting as an 'equals' button
        else if (a !== undefined) {
            b = parseFloat(display.innerText);
            if (operator === 'divide' && b === 0) {
                window.alert("We don't do that here");
                return;
            }

            result = Math.round(operate(operator, a, b) * 1e9) / 1e9;
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
    } else if (input.classList.contains('equals')) {
        if (b === undefined || !operandSwitch) {
            b = parseFloat(display.innerText);
            if (operator === 'divide' && b === 0) {
                window.alert("We don't do that here");
                return;
            }
        }

        result = Math.round(operate(operator, a, b) * 1e9) / 1e9;
        display.innerText = result;
        a = result;
        operandSwitch = true;
    } else if (input.classList.contains('clear')) {
        display.innerText = '0';
        operator = a = b = operandSwitch = decimalPoint = undefined;
    } else {
        let currentInput = input.id;

        // Clear the display and start a new operation
        // if the last button pressed was 'equals'
        if (b !== undefined) {
            operator = a = b = operandSwitch = decimalPoint = undefined;
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
}

function operate(sign, x, y) {
    add = (x, y) => x + y;
    sub = (x, y) => x - y;
    mul = (x, y) => x * y;
    div = (x, y) => x / y;

    switch (sign) {
        case 'add':
            return this.add(x, y);
        case 'subtract':
            return this.subtract(x, y);
        case 'multiply':
            return this.multiply(x, y);
        case 'divide':
            return this.divide(x, y);
        default:
            break;
    }
}
