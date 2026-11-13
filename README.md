# Nube Dorada · sitio web de demostración

Página estática hecha con **HTML, CSS y JavaScript** puros, lista para GitHub Pages. No necesita instalar nada ni compilar.

> Todos los nombres, direcciones, teléfonos, precios y opiniones son **ficticios**.

## Estructura

```
nube-dorada/
├── index.html        Contenido y estructura de la página
├── css/
│   └── styles.css    Estilos, modo claro/oscuro y diseño responsive
├── js/
│   └── script.js     Menú móvil, carta filtrable, horario, formulario...
└── README.md
```

## Publicar en GitHub Pages

1. Entra en GitHub y crea un repositorio nuevo (por ejemplo `nube-dorada`), en modo **público**.
2. En la página del repositorio pulsa **Add file → Upload files** y sube `index.html`, la carpeta `css` y la carpeta `js`. Mantén la estructura de carpetas y pulsa **Commit changes**.
3. Ve a **Settings → Pages**. En **Build and deployment**, elige **Deploy from a branch**, la rama `main` y la carpeta `/ (root)`. Pulsa **Save**.
4. Espera uno o dos minutos. La web estará en `https://TU-USUARIO.github.io/nube-dorada/`.

### Alternativa con Git

```bash
cd nube-dorada
git init
git add .
git commit -m "Primera versión del sitio"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/nube-dorada.git
git push -u origin main
```

Después activa GitHub Pages igual que en el paso 3.

## Personalizarlo

- **Textos:** edita `index.html`. Las ilustraciones están hechas con CSS, así que no necesitas fotos para empezar.
- **Colores y tipografía:** cambia las variables del bloque `:root` al principio de `css/styles.css`.
- **Horario:** cada fila de la tabla tiene `data-days` (0 = domingo … 6 = sábado), `data-open` y `data-close`. El JavaScript las usa para mostrar si el local está abierto.
- **Carta:** cada producto es un `<li class="menu-item">` con `data-category` (`cafes`, `frios`, `reposteria` o `desayunos`). Si añades una categoría nueva, añade también su botón de filtro.

## Sobre el formulario

GitHub Pages solo sirve archivos estáticos. El formulario valida los datos en el navegador, pero **no envía los mensajes a ningún servidor**. Para recibir consultas de verdad, usa un servicio externo de formularios (por ejemplo, Formspree) y adapta el evento `submit` de `js/script.js`.

## Tecnologías

- HTML5 semántico, CSS con variables, Grid y Flexbox, y JavaScript sin librerías.
- Tipografías de Google Fonts (Inter y Playfair Display). Sin conexión se usan fuentes del sistema.
