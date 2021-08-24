const buttons = document.querySelectorAll('.btn');
let operator, a, b, operandSwitch;
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
    } else if (key === 'enter' && a === undefined) {
        return;
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
                } else {
                    input.classList.remove('btn-selected');
                }
            },
            false
        );
        // Background color on key press
        if (input.classList.contains('equals')) {
            input.classList.add('equals-selected');
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
            b = parseInt(display.innerText);
            result = Math.round(operate(operator, a, b) * 1e9) / 1e9;
            display.innerText = result;
            a = result;
            b = undefined;
        }
        // Simple operation with only two operands
        else {
            a = parseInt(display.innerText);
        }
        operator = input.id;
        operandSwitch = true;
    } else if (input.classList.contains('equals')) {
        if (b === undefined || !operandSwitch) {
            b = parseInt(display.innerText);
        }
        if (b === 0) {
            window.alert("We don't do that here");
            return;
        }
        result = Math.round(operate(operator, a, b) * 1e9) / 1e9;

        display.innerText = result;
        a = result;
        operandSwitch = true;
    } else if (input.classList.contains('clear')) {
        display.innerText = '0';
        operator = a = b = operandSwitch = undefined;
    } else {
        // Clear the display and start a new operation
        // if the last button pressed was 'equals'
        if (b !== undefined) {
            operator = a = b = operandSwitch = undefined;
            display.innerText = '';
        }
        // Clear the display when typing the second operand
        // or just starting a new operation
        else if (operandSwitch || display.innerText === '0') {
            display.innerText = '';
        }
        operandSwitch = false;
        display.innerText += input.id;
    }
}

function operate(sign, x, y) {
    switch (sign) {
        case 'add':
            return add(x, y);
        case 'subtract':
            return subtract(x, y);
        case 'multiply':
            return multiply([x, y]);
        case 'divide':
            return divide(x, y);
        case '^':
            return power(x, y);
        case '!':
            return factorial(x);
        default:
            break;
    }
}

const add = function (x, y) {
    return x + y;
};

const multiply = function (numbers) {
    let product = 1;
    for (let i = 0; i < numbers.length; i++) {
        product *= numbers[i];
    }
    return product;
};

const divide = function (x, y) {
    return x / y;
};

const subtract = function (x, y) {
    return x - y;
};

const sum = function (numbers) {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }

    return sum;
};

const power = function (x, y) {
    return Math.pow(x, y);
};

const factorial = function (x) {
    if (x === 0) {
        return 1;
    }

    let factorial = x;
    for (let i = x - 1; i > 0; i--) {
        factorial *= i;
    }
    return factorial;
};
