# 🔮 Password Generator

Un generador de contraseñas seguro, minimalista y elegante.

🌐 **[Ver demo en GitHub Pages](https://aalexiscs.github.io/password-generator/)**

---

## ✨ Características

- 🎲 **Generación criptográficamente segura** — usa `crypto.getRandomValues()` del navegador
- 📏 **Longitud configurable** — de 8 a 64 caracteres con slider interactivo
- 🔡 **Tipos de caracteres** — mayúsculas, minúsculas, números y símbolos
- 💪 **Indicador de fortaleza** — Débil / Media / Fuerte con barra animada y gradiente morado
- 📋 **Copiar al portapapeles** — con feedback visual en el botón y notificación toast
- ⌨️ **Atajos de teclado** — `Enter` para generar, `Ctrl+C` para copiar
- 📱 **Diseño responsive** — funciona en móvil, tablet y escritorio
- 🌊 **Animación de fondo** — blobs animados con gradiente morado-rosa en movimiento continuo

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura semántica |
| **CSS3** | Animaciones de blobs, responsive, spring transitions |
| **Vanilla JavaScript (ES6+)** | Lógica de generación y UI |
| **Inter / System Font** | Tipografía principal (sin dependencia externa) |
| **Fira Code / Cascadia Code** | Fuente monoespaciada para mostrar la contraseña |
| **Material Symbols Rounded** | Íconos de Google |

> Sin frameworks, sin dependencias npm, sin proceso de build. Solo archivos estáticos.

---

## 📁 Estructura del Proyecto

```
password-generator/
├── index.html        # Estructura principal de la app
├── css/
│   └── styles.css    # Estilos Firefox Focus, variables, animaciones de blobs
├── js/
│   └── app.js        # Lógica de generación y eventos
├── .gitignore
└── README.md
```

---

## 🔒 Seguridad

- Las contraseñas se generan **100% en el navegador** — ningún dato sale a internet
- Se usa la **Web Crypto API** (`crypto.getRandomValues`) para aleatoriedad criptográfica
- El algoritmo garantiza que al menos un carácter de cada tipo seleccionado esté presente
- Se aplica un **shuffle Fisher-Yates** criptográfico para evitar patrones predecibles