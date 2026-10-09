// Espera a que el HTML esté listo antes de conectar los controles del sitio.
document.addEventListener("DOMContentLoaded", () => {
  // Referencias a traducciones y elementos controlados por JavaScript.
  const translations = window.portfolioTranslations;
  const languageButtons = [...document.querySelectorAll("[data-set-language]")];
  const views = [...document.querySelectorAll("[data-page-view]")];
  const navigationLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const themeButton = document.querySelector("[data-theme-toggle]");
  let currentLanguage = "es";
  let currentTheme = "dark";

  // Recupera las preferencias guardadas; usa valores predeterminados si no hay acceso.
  try {
    currentLanguage = localStorage.getItem("portfolio-language") === "en" ? "en" : "es";
  } catch {
    currentLanguage = "es";
  }

  try {
    currentTheme = localStorage.getItem("portfolio-theme") === "light" ? "light" : "dark";
  } catch {
    currentTheme = "dark";
  }

  // Aplica el tema, actualiza el estado accesible del botón y guarda la selección.
  function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.dataset.theme = theme;
    themeButton?.setAttribute("aria-pressed", String(theme === "light"));

    const action = theme === "dark"
      ? (currentLanguage === "es" ? "Cambiar a modo claro" : "Switch to light mode")
      : (currentLanguage === "es" ? "Cambiar a modo oscuro" : "Switch to dark mode");
    themeButton?.setAttribute("aria-label", action);
    themeButton?.setAttribute("title", action);

    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      // The selected theme still applies for this page view.
    }
  }

  // Traduce textos, etiquetas accesibles y metadatos al idioma seleccionado.
  function setLanguage(language) {
    const dictionary = translations[language];
    if (!dictionary) return;

    currentLanguage = language;
    document.documentElement.lang = language;
    document.title = dictionary.documentTitle;

    document.querySelectorAll("[data-i18n]").forEach(element => {
      const translation = dictionary[element.dataset.i18n];
      if (translation !== undefined) element.textContent = translation;
    });

    document.querySelectorAll("[data-i18n-html]").forEach(element => {
      const translation = dictionary[element.dataset.i18nHtml];
      if (translation !== undefined) element.innerHTML = translation;
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(element => {
      const translation = dictionary[element.dataset.i18nAriaLabel];
      if (translation !== undefined) element.setAttribute("aria-label", translation);
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(element => {
      const translation = dictionary[element.dataset.i18nAlt];
      if (translation !== undefined) element.alt = translation;
    });

    languageButtons.forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.setLanguage === language));
    });

    setTheme(currentTheme);

    try {
      localStorage.setItem("portfolio-language", language);
    } catch {
      // The selected language still applies for this page view.
    }
  }

  // Conecta los botones de idioma y tema con sus funciones de actualización.
  languageButtons.forEach(button => {
    button.addEventListener("click", () => setLanguage(button.dataset.setLanguage));
  });

  themeButton?.addEventListener("click", () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });

  setTheme(currentTheme);
  setLanguage(currentLanguage);

  // Muestra solo la vista indicada en la URL y marca su enlace como activo.
  function showCurrentView() {
    const requestedId = window.location.hash.slice(1);
    const activeId = views.some(view => view.id === requestedId) ? requestedId : "hero";

    views.forEach(view => {
      view.hidden = view.id !== activeId;
    });

    navigationLinks.forEach(link => {
      if (link.hash === `#${activeId}`) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", showCurrentView);
  showCurrentView();

  // Añade sombra a la barra cuando la página se desplaza hacia abajo.
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    navbar.style.boxShadow = window.scrollY > 50
      ? "0 10px 30px rgba(0, 0, 0, 0.5)"
      : "none";
  });

  const copyEmailButton = document.querySelector("[data-copy-email]");
  const copyEmailLabel = copyEmailButton?.querySelector(".contact-copy-label");
  const copyEmailStatus = document.querySelector(".contact-copy-status");
  let copyFeedbackTimeout;

  // Copia el correo al portapapeles; usa un campo temporal como alternativa.
  copyEmailButton?.addEventListener("click", async () => {
    const email = copyEmailButton.dataset.copyEmail;
    let copied = false;

    if (navigator.clipboard?.writeText && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(email);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      const temporaryInput = document.createElement("textarea");
      temporaryInput.value = email;
      temporaryInput.setAttribute("readonly", "");
      temporaryInput.style.position = "fixed";
      temporaryInput.style.opacity = "0";
      document.body.append(temporaryInput);
      temporaryInput.select();

      try {
        copied = document.execCommand("copy");
      } finally {
        temporaryInput.remove();
      }
    }

    // Anuncia el resultado y restaura el texto del botón después de dos segundos.
    clearTimeout(copyFeedbackTimeout);
    const translationsForLanguage = translations[currentLanguage];
    copyEmailLabel.textContent = copied
      ? translationsForLanguage["contact.copied"]
      : translationsForLanguage["contact.copyFailed"];
    copyEmailStatus.textContent = copied
      ? translationsForLanguage["contact.copiedStatus"]
      : translationsForLanguage["contact.copyFailedStatus"];

    copyFeedbackTimeout = window.setTimeout(() => {
      copyEmailLabel.textContent = translations[currentLanguage]["contact.email"];
      copyEmailStatus.textContent = "";
    }, 2000);
  });
});