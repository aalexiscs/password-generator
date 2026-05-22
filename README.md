# 🔑 Password Generator

Un generador de contraseñas seguro, minimalista y elegante. Diseñado con un estilo **iOS / Apple** — tipografía del sistema, colores nativos de iOS y componentes que replican la experiencia de Settings en iPhone.

🌐 **[Ver demo en GitHub Pages](https://aalexiscs.github.io/password-generator/)**

---

## ✨ Características

- 🎲 **Generación criptográficamente segura** — usa `crypto.getRandomValues()` del navegador
- 📏 **Longitud configurable** — de 8 a 64 caracteres con slider interactivo estilo iOS
- 🔡 **Tipos de caracteres** — mayúsculas, minúsculas, números y símbolos
- 💪 **Indicador de fortaleza** — Débil / Media / Fuerte con barra animada
- 📋 **Copiar al portapapeles** — con feedback visual en el botón y notificación toast
- 🔔 **Toast notification** — notificación estilo iOS al copiar la contraseña
- ⌨️ **Atajos de teclado** — `Enter` para generar, `Ctrl+C` para copiar
- 📱 **Diseño responsive** — funciona en móvil, tablet y escritorio
- 🍎 **Diseño iOS / Apple** — fuente del sistema, colores nativos, toggles y slider estilo iOS

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura semántica |
| **CSS3** | Variables iOS, animaciones, responsive, glassmorphism |
| **Vanilla JavaScript (ES6+)** | Lógica de generación y UI |
| **SF Pro / System Font** | Tipografía nativa de Apple (sin dependencia externa) |
| **Material Symbols Rounded** | Íconos de Google |

> Sin frameworks, sin dependencias npm, sin proceso de build. Solo archivos estáticos.

---

## 📁 Estructura del Proyecto

```
password-generator/
├── index.html        # Estructura principal de la app
├── css/
│   └── styles.css    # Estilos iOS, variables, animaciones
├── js/
│   └── app.js        # Lógica de generación y eventos
└── README.md
```

---

## 🚀 Uso Local

Solo abre `index.html` en tu navegador — no requiere servidor ni instalación:

```bash
# Opción 1: Abrir directamente
start index.html

# Opción 2: Con Live Server de VS Code
# Clic derecho en index.html → "Open with Live Server"
```

---

## 🌐 Despliegue en GitHub Pages

1. Sube el repositorio a GitHub
2. Ve a **Settings → Pages**
3. En **Source**, selecciona la rama `main` y la carpeta `/ (root)`
4. Guarda — en unos minutos estará disponible en:
   `https://<tu-usuario>.github.io/password-generator/`

---

## 🎨 Paleta de Colores — iOS Design System

| Color | Hex | Uso |
|---|---|---|
| iOS Blue | `#007AFF` | Primario, botones, slider, íconos |
| iOS Green | `#34C759` | Toggles activos, fortaleza fuerte, toast |
| iOS Orange | `#FF9500` | Fortaleza media |
| iOS Red | `#FF3B30` | Fortaleza débil |
| System Background | `#F2F2F7` | Fondo general |
| Card Background | `#FFFFFF` | Tarjetas |
| Label Primary | `#1C1C1E` | Texto principal |
| Label Secondary | `#8E8E93` | Texto secundario |

---

## 🔒 Seguridad

- Las contraseñas se generan **100% en el navegador** — ningún dato sale a internet
- Se usa la **Web Crypto API** (`crypto.getRandomValues`) para aleatoriedad criptográfica
- El algoritmo garantiza que al menos un carácter de cada tipo seleccionado esté presente
- Se aplica un **shuffle Fisher-Yates** criptográfico para evitar patrones predecibles

---

## 📄 Licencia

MIT © [aalexiscs](https://github.com/aalexiscs)
