/* ============================================================
   Password Generator — app.js
   ============================================================ */

'use strict';

// ── Character sets ──────────────────────────────────────────
const CHARS = {
  upper:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower:   'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
};

// ── DOM references ───────────────────────────────────────────
const lengthSlider    = document.getElementById('lengthSlider');
const lengthValue     = document.getElementById('lengthValue');
const toggleUpper     = document.getElementById('toggleUpper');
const toggleLower     = document.getElementById('toggleLower');
const toggleNumbers   = document.getElementById('toggleNumbers');
const toggleSymbols   = document.getElementById('toggleSymbols');
const toggleAutoCopy  = document.getElementById('toggleAutoCopy');
const generateBtn     = document.getElementById('generateBtn');
const passwordText    = document.getElementById('passwordText');
const copyBtn         = document.getElementById('copyBtn');
const copyIcon        = document.getElementById('copyIcon');
const strengthSection = document.getElementById('strengthSection');
const strengthBar     = document.getElementById('strengthBar');
const strengthLabel   = document.getElementById('strengthLabel');
const toast           = document.getElementById('toast');

// ── State ────────────────────────────────────────────────────
let currentPassword = '';
let copyTimeout     = null;
let toastTimeout    = null;

// ── Slider: update fill & badge ──────────────────────────────
function updateSliderFill() {
  const min = Number(lengthSlider.min);
  const max = Number(lengthSlider.max);
  const val = Number(lengthSlider.value);
  const pct = ((val - min) / (max - min)) * 100;

  lengthSlider.style.background =
    `linear-gradient(to right, #7542E5 ${pct}%, rgba(21,20,26,0.05) ${pct}%)`;

  lengthValue.textContent = val;
}

// ── Password generation (crypto-safe) ───────────────────────
function generatePassword() {
  const length = Number(lengthSlider.value);

  // Build charset from active toggles
  let charset = '';
  const required = [];

  if (toggleUpper.checked)   { charset += CHARS.upper;   required.push(randomChar(CHARS.upper));   }
  if (toggleLower.checked)   { charset += CHARS.lower;   required.push(randomChar(CHARS.lower));   }
  if (toggleNumbers.checked) { charset += CHARS.numbers; required.push(randomChar(CHARS.numbers)); }
  if (toggleSymbols.checked) { charset += CHARS.symbols; required.push(randomChar(CHARS.symbols)); }

  // At least one option must be selected
  if (!charset) {
    shakeCard();
    return;
  }

  // Fill remaining characters
  const remaining = length - required.length;
  const pool = [];
  for (let i = 0; i < remaining; i++) {
    pool.push(randomChar(charset));
  }

  // Merge required + pool and shuffle
  const all = [...required, ...pool];
  shuffleArray(all);

  currentPassword = all.join('');
  displayPassword(currentPassword);
  updateStrength(currentPassword);
  enableCopyBtn();

  // Auto-copy if enabled
  if (toggleAutoCopy && toggleAutoCopy.checked) {
    copyPassword();
  }
}

// ── Cryptographically secure random char ────────────────────
function randomChar(str) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return str[array[0] % str.length];
}

// ── Fisher-Yates shuffle (crypto-safe) ──────────────────────
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const j = array[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ── Display password with animation ─────────────────────────
function displayPassword(pwd) {
  passwordText.classList.remove('placeholder', 'pop-in');
  // Force reflow to restart animation
  void passwordText.offsetWidth;
  passwordText.classList.add('pop-in');
  passwordText.textContent = pwd;
}

// ── Strength calculator ──────────────────────────────────────
function calcStrength(pwd) {
  let score = 0;

  // Length score
  if (pwd.length >= 12) score++;
  if (pwd.length >= 20) score++;

  // Variety score
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
}

const STRENGTH_LABELS = {
  weak:   'Débil',
  medium: 'Media',
  strong: 'Fuerte',
};

function updateStrength(pwd) {
  const level = calcStrength(pwd);

  strengthSection.style.display = 'flex';

  // Reset classes
  strengthBar.className   = 'strength-bar';
  strengthLabel.className = 'strength-label';

  // Apply new level
  strengthBar.classList.add(level);
  strengthLabel.classList.add(level);
  strengthLabel.textContent = STRENGTH_LABELS[level];
}

// ── Copy to clipboard ────────────────────────────────────────
async function copyPassword() {
  if (!currentPassword) return;

  try {
    await navigator.clipboard.writeText(currentPassword);
    showCopiedFeedback();
  } catch {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = currentPassword;
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showCopiedFeedback();
  }
}

function showCopiedFeedback() {
  // Button feedback
  copyBtn.classList.add('copied');
  copyIcon.textContent = 'check';

  clearTimeout(copyTimeout);
  copyTimeout = setTimeout(() => {
    copyBtn.classList.remove('copied');
    copyIcon.textContent = 'content_copy';
  }, 2000);

  // Toast notification
  clearTimeout(toastTimeout);
  toast.classList.add('toast-visible');
  toastTimeout = setTimeout(() => {
    toast.classList.remove('toast-visible');
  }, 2000);
}

function enableCopyBtn() {
  copyBtn.disabled = false;
}

// ── Shake animation when no charset selected ─────────────────
function shakeCard() {
  const card = document.querySelector('.password-card');
  card.classList.remove('shake');
  void card.offsetWidth;
  card.classList.add('shake');
}

// ── Ensure at least one toggle stays on ─────────────────────
function guardToggles(changedToggle) {
  const all = [toggleUpper, toggleLower, toggleNumbers, toggleSymbols];
  const anyChecked = all.some(t => t.checked);

  if (!anyChecked) {
    // Re-enable the one that was just unchecked
    changedToggle.checked = true;
  }
}

// ── Event listeners ──────────────────────────────────────────
lengthSlider.addEventListener('input', () => {
  updateSliderFill();
});

generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyPassword);

[toggleUpper, toggleLower, toggleNumbers, toggleSymbols].forEach(toggle => {
  toggle.addEventListener('change', () => guardToggles(toggle));
});

// Keyboard shortcut: Enter to generate, Ctrl+C to copy
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement !== copyBtn) {
    generateBtn.click();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'c' && currentPassword) {
    // Only intercept if not selecting text
    if (!window.getSelection()?.toString()) {
      e.preventDefault();
      copyPassword();
    }
  }
});

// ── Init ─────────────────────────────────────────────────────
updateSliderFill();
generatePassword(); // Generate one on load
