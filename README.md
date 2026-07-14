# 🔑 Password Generator

Un generador de contraseñas seguro, minimalista y elegante.

<a href="https://aalexiscs.github.io/password-generator/" target="_blank" rel="noopener noreferrer">
  <img src="https://img.shields.io/badge/🔑%20Pruébalo%20ahora-GitHub%20Pages-7542E5?style=for-the-badge&logoColor=white" alt="Pruébalo ahora en GitHub Pages" />
</a>

---

## Características

- **PWA (Progressive Web App):** Instalable en dispositivos móviles y de escritorio, con soporte para uso sin conexión (offline).
- **Modo Oscuro / Claro:** Soporte nativo para temas con cambio manual y detección automática de preferencias del sistema.
- **Interfaz Flat Design Moderno:** Diseño limpio, responsive y con animaciones fluidas de fondo.
- Generación criptográficamente segura con `crypto.getRandomValues()`.
- Longitud configurable de 8 a 64 caracteres.
- Soporte para mayúsculas, minúsculas, números y símbolos.
- Indicador de fortaleza animado (Débil / Media / Fuerte).
- Copiar al portapapeles con feedback visual y toast.
- Atajos de teclado: `Enter` para generar, `Ctrl+C` para copiar.

---

## Stack

`HTML5` · `CSS3` · `Vanilla JS (ES6+)` · `Material Symbols Rounded`

> Sin frameworks, sin dependencias npm, sin proceso de build.

---

## Estructura

```
password-generator/
├── index.html
├── manifest.json
├── sw.js
├── icon.svg
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── .gitignore
└── README.md
```

---

## Seguridad

Las contraseñas se generan **100% en el navegador** usando la Web Crypto API. Se garantiza al menos un carácter de cada tipo seleccionado y se aplica un shuffle Fisher-Yates criptográfico.