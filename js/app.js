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
const themeToggle     = document.getElementById('themeToggle');
const themeIcon       = document.getElementById('themeIcon');
const lengthSlider    = document.getElementById('lengthSlider');
const lengthValue     = document.getElementById('lengthValue');
const toggleUpper     = document.getElementById('toggleUpper');
const toggleLower     = document.getElementById('toggleLower');
const toggleNumbers   = document.getElementById('toggleNumbers');
const toggleSymbols   = document.getElementById('toggleSymbols');
const toggleAutoCopy  = document.getElementById('toggleAutoCopy');
const generateBtn     = document.getElementById('generateBtn');
const shareBtn        = document.getElementById('shareBtn');
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

// ── Theme Management ─────────────────────────────────────────
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = 'light_mode';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.textContent = 'dark_mode';
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeIcon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
  
  updateSliderFill();
}

// ── Slider: update fill & badge ──────────────────────────────
function updateSliderFill() {
  const min = Number(lengthSlider.min);
  const max = Number(lengthSlider.max);
  const val = Number(lengthSlider.value);
  const pct = ((val - min) / (max - min)) * 100;

  // Get colors from CSS variables
  const rootStyles = getComputedStyle(document.documentElement);
  const primaryColor = rootStyles.getPropertyValue('--primary-color').trim() || '#6366F1';
  const trackColor = rootStyles.getPropertyValue('--bg-input').trim() || '#F8FAFC';

  lengthSlider.style.background =
    `linear-gradient(to right, ${primaryColor} ${pct}%, ${trackColor} ${pct}%)`;

  lengthValue.textContent = val;
}

// ── Password generation (crypto-safe) ───────────────────────
function generatePassword() {
  const length = Number(lengthSlider.value);

  let charset = '';
  const required = [];

  if (toggleUpper.checked)   { charset += CHARS.upper;   required.push(randomChar(CHARS.upper));   }
  if (toggleLower.checked)   { charset += CHARS.lower;   required.push(randomChar(CHARS.lower));   }
  if (toggleNumbers.checked) { charset += CHARS.numbers; required.push(randomChar(CHARS.numbers)); }
  if (toggleSymbols.checked) { charset += CHARS.symbols; required.push(randomChar(CHARS.symbols)); }

  if (!charset) {
    shakeCard();
    return;
  }

  const remaining = length - required.length;
  const pool = [];
  for (let i = 0; i < remaining; i++) {
    pool.push(randomChar(charset));
  }

  const all = [...required, ...pool];
  shuffleArray(all);

  currentPassword = all.join('');
  displayPassword(currentPassword);
  updateStrength(currentPassword);
  enableCopyBtn();

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
  void passwordText.offsetWidth; // Force reflow
  passwordText.classList.add('pop-in');
  passwordText.textContent = pwd;
}

// ── Strength calculator ──────────────────────────────────────
function calcStrength(pwd) {
  let score = 0;

  if (pwd.length >= 12) score++;
  if (pwd.length >= 20) score++;

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

  strengthBar.className   = 'strength-bar';
  strengthLabel.className = 'strength-label';

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
  copyBtn.classList.add('copied');
  copyIcon.textContent = 'check';

  clearTimeout(copyTimeout);
  copyTimeout = setTimeout(() => {
    copyBtn.classList.remove('copied');
    copyIcon.textContent = 'content_copy';
  }, 2000);

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
  const card = document.querySelector('.main-card');
  card.classList.remove('shake');
  void card.offsetWidth;
  card.classList.add('shake');
}

// ── Ensure at least one toggle stays on ─────────────────────
function guardToggles(changedToggle) {
  const all = [toggleUpper, toggleLower, toggleNumbers, toggleSymbols];
  const anyChecked = all.some(t => t.checked);

  if (!anyChecked) {
    changedToggle.checked = true;
  }
}

// ── Event listeners ──────────────────────────────────────────
themeToggle.addEventListener('click', toggleTheme);

lengthSlider.addEventListener('input', updateSliderFill);

generateBtn.addEventListener('click', generatePassword);

shareBtn.addEventListener('click', async () => {
  const shareData = {
    title: 'Password Generator',
    text: 'Genera contraseñas seguras fácilmente.',
    url: 'https://aalexiscs.github.io/password-generator/'
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      
      // Reutilizamos el toast para mostrar que se copió el enlace
      const originalText = toast.querySelector('.toast-text').textContent;
      toast.querySelector('.toast-text').textContent = 'Enlace copiado';
      
      clearTimeout(toastTimeout);
      toast.classList.add('toast-visible');
      toastTimeout = setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => {
          toast.querySelector('.toast-text').textContent = originalText;
        }, 300); // Esperar a que termine la animación de salida
      }, 2000);
    }
  } catch (err) {
    console.error('Error al compartir:', err);
  }
});

copyBtn.addEventListener('click', copyPassword);

[toggleUpper, toggleLower, toggleNumbers, toggleSymbols].forEach(toggle => {
  toggle.addEventListener('change', () => guardToggles(toggle));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement !== copyBtn) {
    generateBtn.click();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'c' && currentPassword) {
    if (!window.getSelection()?.toString()) {
      e.preventDefault();
      copyPassword();
    }
  }
});

// ── Init ─────────────────────────────────────────────────────
initTheme();
updateSliderFill();
generatePassword();

// ── PWA Service Worker Registration ──────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}
