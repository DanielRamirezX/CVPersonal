/* ==========================================================================
   Nube Dorada · Comportamiento de la página
   Índice: 1 Preparación · 2 Tema · 3 Menú móvil · 4 Cabecera · 5 Animaciones
           6 Contadores · 7 Carta · 8 Horario · 9 Preguntas · 10 Formulario · 11 Año
   ========================================================================== */

(() => {
  "use strict";

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsObserver = "IntersectionObserver" in window;

  // 1. Preparación: la hoja de estilos usa esta clase para ocultar lo que se anima
  root.classList.add("js");

  // 2. Tema claro / oscuro ---------------------------------------------------
  const themeButton = document.querySelector(".theme-toggle");
  const themeIcon = themeButton.querySelector("span");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  const THEME_KEY = "nube-dorada-tema";

  const readSavedTheme = () => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null; // Almacenamiento no disponible (modo privado, bloqueos...)
    }
  };

  const saveTheme = (theme) => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      // Si no se puede guardar, el cambio solo dura esta visita
    }
  };

  const isDarkTheme = () => {
    const chosen = root.getAttribute("data-theme");
    return chosen ? chosen === "dark" : systemDark.matches;
  };

  const updateThemeButton = () => {
    const dark = isDarkTheme();
    themeIcon.textContent = dark ? "☀️" : "🌙";
    themeButton.setAttribute("aria-label", dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
  };

  const savedTheme = readSavedTheme();
  if (savedTheme === "light" || savedTheme === "dark") {
    root.setAttribute("data-theme", savedTheme);
  }
  updateThemeButton();

  themeButton.addEventListener("click", () => {
    const nextTheme = isDarkTheme() ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);
    saveTheme(nextTheme);
    updateThemeButton();
  });

  // Si el visitante no ha elegido tema, seguimos los cambios del sistema
  systemDark.addEventListener("change", () => {
    if (!root.hasAttribute("data-theme")) updateThemeButton();
  });

  // 3. Menú móvil ------------------------------------------------------------
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".nav-toggle");
  const menu = document.getElementById("menu-principal");

  const setMenuOpen = (open) => {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menu.classList.toggle("is-open", open);
  };

  menuButton.addEventListener("click", () => {
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
  });

  // Al elegir una sección, el menú se cierra
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuButton.focus();
    }
  });

  // En escritorio el menú siempre está visible; limpiamos el estado móvil
  window.matchMedia("(min-width: 981px)").addEventListener("change", (event) => {
    if (event.matches) setMenuOpen(false);
  });

  // 4. Sombra en la cabecera al hacer scroll ----------------------------------
  const updateHeaderShadow = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  updateHeaderShadow();
  window.addEventListener("scroll", updateHeaderShadow, { passive: true });

  // 5. Animaciones al entrar en pantalla --------------------------------------
  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  if (prefersReducedMotion || !supportsObserver) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    // Efecto escalonado: los hermanos aparecen uno detrás de otro
    revealItems.forEach((item) => {
      const siblings = Array.from(item.parentElement.children).filter((el) => el.classList.contains("reveal"));
      item.style.transitionDelay = `${Math.min(siblings.indexOf(item) * 90, 360)}ms`;
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        target.classList.add("is-visible");
        // Al terminar la entrada quitamos el retraso, para que los efectos al pasar el ratón respondan al instante
        target.addEventListener("transitionend", (event) => {
          if (event.target === target) target.style.transitionDelay = "";
        });
        observer.unobserve(target);
      });
    }, { threshold: 0.15 });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // 6. Contadores animados ----------------------------------------------------
  const counters = Array.from(document.querySelectorAll("[data-count]"));

  const formatNumber = (value, decimals) =>
    value.toLocaleString("es-ES", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const decimalsOf = (element) => Number(element.dataset.decimals || 0);

  const runCounter = (element) => {
    const target = Number(element.dataset.count);
    const decimals = decimalsOf(element);
    const duration = 1600;
    const start = performance.now();

    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Curva que frena al final
      element.textContent = formatNumber(target * eased, decimals);
      if (progress < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  if (!prefersReducedMotion && supportsObserver) {
    counters.forEach((element) => {
      element.textContent = formatNumber(0, decimalsOf(element));
    });

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach((element) => counterObserver.observe(element));
  } else {
    counters.forEach((element) => {
      element.textContent = formatNumber(Number(element.dataset.count), decimalsOf(element));
    });
  }

  // 7. Carta: filtrar por categoría -------------------------------------------
  const filterButtons = Array.from(document.querySelectorAll(".filter"));
  const menuItems = Array.from(document.querySelectorAll(".menu-item"));
  const menuStatus = document.getElementById("resultados-carta");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;

      filterButtons.forEach((other) => {
        other.setAttribute("aria-pressed", String(other === button));
      });

      let visible = 0;
      menuItems.forEach((item) => {
        const show = category === "todo" || item.dataset.category === category;
        item.hidden = !show;
        if (show) visible += 1;
      });

      // Aviso para lectores de pantalla
      menuStatus.textContent = visible === 1
        ? "Mostrando 1 producto"
        : `Mostrando ${visible} productos`;
    });
  });

  // 8. Horario y estado "abierto ahora" ---------------------------------------
  // El horario sale de los atributos data-* de la tabla (una sola fuente de verdad)
  const scheduleRows = Array.from(document.querySelectorAll(".hours tr[data-days]")).map((row) => ({
    row,
    days: row.dataset.days.split(",").map(Number),
    open: row.dataset.open,
    close: row.dataset.close,
  }));

  const statusBox = document.getElementById("estado-ahora");
  const statusText = statusBox.querySelector(".status-text");
  const dayNames = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  const toMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const scheduleFor = (day) => scheduleRows.find((item) => item.days.includes(day));

  const updateOpeningStatus = () => {
    const now = new Date();
    const today = now.getDay();
    const minutesNow = now.getHours() * 60 + now.getMinutes();

    scheduleRows.forEach((item) => {
      item.row.classList.toggle("is-today", item.days.includes(today));
    });

    const todaySchedule = scheduleFor(today);
    const isOpen = Boolean(todaySchedule)
      && minutesNow >= toMinutes(todaySchedule.open)
      && minutesNow < toMinutes(todaySchedule.close);

    statusBox.classList.toggle("is-open", isOpen);
    statusBox.classList.toggle("is-closed", !isOpen);

    if (isOpen) {
      statusText.textContent = `Abierto ahora · cerramos a las ${todaySchedule.close}`;
      return;
    }

    // Buscamos la próxima apertura, empezando por hoy
    for (let offset = 0; offset < 7; offset += 1) {
      const day = (today + offset) % 7;
      const schedule = scheduleFor(day);
      if (!schedule) continue;
      if (offset === 0 && minutesNow >= toMinutes(schedule.open)) continue;

      const when = offset === 0 ? "hoy" : offset === 1 ? "mañana" : `el ${dayNames[day]}`;
      statusText.textContent = `Cerrado ahora · abrimos ${when} a las ${schedule.open}`;
      return;
    }

    statusText.textContent = "Cerrado ahora";
  };

  updateOpeningStatus();
  setInterval(updateOpeningStatus, 60 * 1000);

  // 9. Preguntas frecuentes: solo una respuesta abierta a la vez --------------
  const faqItems = Array.from(document.querySelectorAll(".faq-item"));

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  // 10. Formulario de contacto -------------------------------------------------
  // GitHub Pages solo sirve archivos estáticos: el formulario valida los datos en el
  // navegador y muestra una confirmación, pero no envía nada a ningún servidor.
  const form = document.getElementById("formulario-contacto");
  const formStatus = document.getElementById("estado-formulario");
  const fields = Array.from(form.querySelectorAll("input[name], textarea[name]"));

  const rules = {
    nombre: {
      isValid: (input) => input.value.trim().length >= 2,
      message: "Escribe tu nombre (al menos 2 caracteres).",
    },
    email: {
      isValid: (input) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim()),
      message: "Introduce un correo válido, por ejemplo nombre@ejemplo.com.",
    },
    mensaje: {
      isValid: (input) => input.value.trim().length >= 10,
      message: "El mensaje debe tener al menos 10 caracteres.",
    },
    privacidad: {
      isValid: (input) => input.checked,
      message: "Necesitamos tu aceptación para responder a tu consulta.",
    },
  };

  const validateField = (input) => {
    const rule = rules[input.name];
    if (!rule) return true;

    const valid = rule.isValid(input);
    const errorBox = document.getElementById(`error-${input.name}`);

    input.setAttribute("aria-invalid", String(!valid));
    input.closest(".field").classList.toggle("has-error", !valid);
    errorBox.textContent = valid ? "" : rule.message;
    return valid;
  };

  fields.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      // Una vez marcado el error, se revisa en directo hasta corregirlo
      if (input.getAttribute("aria-invalid") === "true") validateField(input);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const results = fields.map((input) => validateField(input));
    const firstInvalid = fields[results.indexOf(false)];

    if (firstInvalid) {
      formStatus.className = "form-status is-error";
      formStatus.textContent = "Revisa los campos marcados en rojo.";
      firstInvalid.focus();
      return;
    }

    const name = form.elements.nombre.value.trim();
    form.reset();
    formStatus.className = "form-status is-success";
    formStatus.textContent = `¡Gracias, ${name}! Hemos recibido tu mensaje y te responderemos en menos de 24 horas.`;
  });

  // 11. Año actual en el pie de página ------------------------------------------
  const yearElement = document.getElementById("anio");
  if (yearElement) yearElement.textContent = String(new Date().getFullYear());
})();
