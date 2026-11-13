# Nube Dorada · sitio web de demostración

Página estática hecha con **HTML, CSS y JavaScript** puros, lista para GitHub Pages. No necesita instalar nada ni compilar.

> Todos los nombres, direcciones, teléfonos, precios y opiniones son **ficticios**.

## Estilo visual

Diseño **neobrutalista**: bordes gruesos, sombras duras sin desenfoque, colores planos y saturados, y tipografía de bloque. Los botones y las tarjetas se "hunden" al pulsarlos.

- Tipografías de Google Fonts: Archivo Black (titulares), Space Grotesk (texto) y Space Mono (etiquetas y precios). Sin conexión se usan fuentes del sistema.
- Modo claro y oscuro. El botón de la cabecera recuerda la elección del visitante.

## Estructura

```
nube-dorada/
├── index.html        Contenido y estructura de la página
├── css/
│   └── styles.css    Diseño neobrutalista, modo claro/oscuro y responsive
├── js/
│   └── script.js     Menú móvil, carta filtrable, horario, formulario...
└── README.md
```

## Publicar en GitHub Pages

1. Crea un repositorio público en GitHub (por ejemplo `nube-dorada`).
2. Sube `index.html`, la carpeta `css` y la carpeta `js` a la rama `main`. Puedes arrastrarlos en **Add file → Upload files**.
3. Ve a **Settings → Pages**. En **Build and deployment**, elige **Deploy from a branch**, la rama `main` y la carpeta `/ (root)`. Pulsa **Save**.
4. Espera uno o dos minutos. La web estará en `https://TU-USUARIO.github.io/nube-dorada/`.

> Si esta carpeta ya es un repositorio git, revisa el remoto con `git remote -v` antes de hacer `git push`. Un push cambia lo que se publica en ese repositorio.

### Con git

Si la carpeta todavía no es un repositorio:

```bash
cd nube-dorada
git init
git add .
git commit -m "Rediseño neobrutalista"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/nube-dorada.git
git push -u origin main
```

Si ya es un repositorio con su remoto configurado:

```bash
cd nube-dorada
git add .
git commit -m "Rediseño neobrutalista"
git push
```

## Personalizarlo

- **Textos:** edita `index.html`. Las ilustraciones son SVG y CSS, así que no necesitas fotos.
- **Colores:** cambia las variables del bloque `:root` al principio de `css/styles.css`: `--paper` (fondo), `--ink` (bordes y texto), `--brand` (dorado), `--pink`, `--mint` y `--sky`. El modo oscuro está en los bloques `:root[data-theme="dark"]` y en la media query de preferencia del sistema.
- **Grosor y sombras:** `--border` y `--sh-sm`, `--sh-md`, `--sh-lg`.
- **Banda animada:** el texto está en los dos `.marquee-group` del marcado. Son idénticos a propósito, para que el bucle sea continuo; cambia ambos igual.
- **Sello giratorio:** el texto del círculo es el `textPath` de `index.html`.
- **Horario:** cada fila de la tabla tiene `data-days` (0 = domingo … 6 = sábado), `data-open` y `data-close`. El JavaScript las usa para mostrar si el local está abierto.
- **Carta:** cada producto es un `<li class="menu-item">` con `data-category` (`cafes`, `frios`, `reposteria` o `desayunos`). Si añades una categoría, añade también su botón de filtro y su color en el CSS.

## Sobre el formulario

GitHub Pages solo sirve archivos estáticos. El formulario valida los datos en el navegador, pero **no envía los mensajes a ningún servidor**. Para recibir consultas de verdad, usa un servicio externo de formularios (por ejemplo, Formspree) y adapta el evento `submit` de `js/script.js`.

## Accesibilidad

- Texto oscuro sobre colores claros, con contraste alto también en el modo oscuro.
- Foco visible en todos los controles, que son botones y enlaces nativos.
- Con `prefers-reduced-motion` desaparecen las animaciones de entrada, la banda, el sello y el vapor de la taza.
