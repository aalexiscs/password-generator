// DOM Elements
const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const lengthValEl = document.getElementById('length-val');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateEl = document.getElementById('generate');
const clipboardEl = document.getElementById('clipboard');
const strengthTextEl = document.getElementById('strength-text');
const strengthIndicatorEl = document.querySelector('.strength-indicator');

// Character Sets
const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

// Update length value display when slider moves
lengthEl.addEventListener('input', (e) => {
    lengthValEl.textContent = e.target.value;
    updateSliderBackground(e.target);
});

// Initialize slider background
function updateSliderBackground(slider) {
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, var(--primary-color) ${value}%, var(--primary-light) ${value}%)`;
}
updateSliderBackground(lengthEl);

// Function to copy password to clipboard
function copyToClipboard() {
    const password = resultEl.textContent;

    if (!password) {
        return;
    }

    navigator.clipboard.writeText(password).then(() => {
        // Show Toastify notification
        Toastify({
            text: "¡Contraseña copiada!",
            duration: 3000,
            gravity: "top",
            position: "center",
            style: {
                background: "var(--text-main)",
                color: "#FFFFFF",
                border: "none"
            }
        }).showToast();
    });
}

// Generate Password Event
generateEl.addEventListener('click', () => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    const newPassword = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
    
    if (newPassword) {
        resultEl.textContent = newPassword;
        resultEl.classList.add('active');
        updateStrength(length, hasLower, hasUpper, hasNumber, hasSymbol);
        
        // Automatically copy to clipboard
        copyToClipboard();
    }
});

// Copy to Clipboard Event (Manual)
clipboardEl.addEventListener('click', copyToClipboard);

// Generate Password Function
function generatePassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);

    // If no options selected
    if (typesCount === 0) {
        return '';
    }

    // Ensure at least one of each selected type is included
    for (let i = 0; i < typesArr.length; i++) {
        const funcName = Object.keys(typesArr[i])[0];
        generatedPassword += randomFunc[funcName]();
    }

    // Fill the rest of the password length
    for (let i = typesArr.length; i < length; i++) {
        const randomType = Object.keys(typesArr[getSecureRandom(typesArr.length)])[0];
        generatedPassword += randomFunc[randomType]();
    }

    // Shuffle the password to ensure randomness (Fisher-Yates)
    let passwordArray = generatedPassword.split('');
    for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = getSecureRandom(i + 1);
        [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }
    const finalPassword = passwordArray.join('');

    return finalPassword;
}

// Calculate and Update Strength
function updateStrength(length, lower, upper, number, symbol) {
    const typesCount = lower + upper + number + symbol;
    let strength = 0;

    // Reset classes
    strengthIndicatorEl.className = 'strength-indicator';

    if (typesCount === 0 || length === 0) {
        strengthTextEl.textContent = '';
        return;
    }

    // Basic strength calculation
    if (length >= 8) strength += 1;
    if (length >= 12) strength += 1;
    if (typesCount >= 3) strength += 1;
    if (typesCount === 4 && length >= 10) strength += 1;

    // Cap strength at 4
    strength = Math.min(strength, 4);
    // Ensure minimum strength of 1 if something is generated
    strength = Math.max(strength, 1);

    // Update UI
    strengthIndicatorEl.classList.add(`strength-${strength}`);

    const strengthLabels = {
        1: 'DÉBIL',
        2: 'REGULAR',
        3: 'BUENA',
        4: 'FUERTE'
    };

    strengthTextEl.textContent = strengthLabels[strength];
}

// Secure random number generator (0 to max-1)
function getSecureRandom(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
}

// Generator Functions
function getRandomLower() {
    return String.fromCharCode(getSecureRandom(26) + 97);
}

function getRandomUpper() {
    return String.fromCharCode(getSecureRandom(26) + 65);
}

function getRandomNumber() {
    return String.fromCharCode(getSecureRandom(10) + 48);
}

function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.';
    return symbols[getSecureRandom(symbols.length)];
}

// Initialize on load
function init() {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    // Generate initial password
    const initialPassword = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
    
    if (initialPassword) {
        resultEl.textContent = initialPassword;
        resultEl.classList.add('active');
        updateStrength(length, hasLower, hasUpper, hasNumber, hasSymbol);
    }
}

// Run initialization
init();
