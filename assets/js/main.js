// Espera a que el HTML esté listo antes de conectar los controles del sitio.
document.addEventListener("DOMContentLoaded", () => {
  // Referencias a traducciones y elementos controlados por JavaScript.
  const translations = window.portfolioTranslations;
  const languageButtons = [...document.querySelectorAll("[data-set-language]")];
  const views = [...document.querySelectorAll("[data-page-view]")];
  const navigationLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const themeButton = document.querySelector("[data-theme-toggle]");
  const projectTrack = document.querySelector("[data-projects-track]");
  const projectScrollButtons = [...document.querySelectorAll("[data-project-scroll]")];
  const projectCards = [...(projectTrack?.querySelectorAll("[data-project-slide]") ?? [])];
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileProjectStackQuery = window.matchMedia("(max-width: 600px)");
  const logoText = document.querySelector("[data-typewriter]");
  let currentLanguage = "es";
  let currentTheme = "dark";

  if (logoText && !reducedMotionQuery.matches) {
    const fullText = logoText.textContent;
    let characterIndex = 0;
    logoText.textContent = "";
    logoText.classList.add("is-typing");

    const typingTimer = window.setInterval(() => {
      characterIndex += 1;
      logoText.textContent = fullText.slice(0, characterIndex);

      if (characterIndex >= fullText.length) {
        window.clearInterval(typingTimer);
        logoText.classList.remove("is-typing");
      }
    }, 65);
  }

  function updateProjectCarousel() {
    if (!projectTrack || projectCards.length === 0) return;

    if (projectTrack.closest("[hidden]")) {
      projectCards.forEach(card => card.querySelector("video")?.pause());
      return;
    }

    const trackCenter = mobileProjectStackQuery.matches
      ? window.innerHeight / 2
      : projectTrack.getBoundingClientRect().left + projectTrack.clientWidth / 2;
    let activeIndex = 0;
    let closestDistance = Infinity;

    projectCards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = mobileProjectStackQuery.matches
        ? cardRect.top + cardRect.height / 2
        : cardRect.left + cardRect.width / 2;
      const distance = Math.abs(trackCenter - cardCenter);

      if (distance < closestDistance) {
        activeIndex = index;
        closestDistance = distance;
      }
    });

    projectCards.forEach((card, index) => {
      const isActive = index === activeIndex;
      const video = card.querySelector("video");

      card.classList.toggle("is-active", isActive);
      if (isActive) {
        card.setAttribute("aria-current", "true");
      } else {
        card.removeAttribute("aria-current");
      }

      if (!video) return;
      if (isActive && !reducedMotionQuery.matches) {
        if (video.paused) video.play().catch(() => {});
      } else if (!video.paused) {
        video.pause();
      }
    });

    projectScrollButtons.forEach(button => {
      button.disabled = Number(button.dataset.projectScroll) < 0
        ? activeIndex === 0
        : activeIndex === projectCards.length - 1;
    });

  }

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

    requestAnimationFrame(updateProjectCarousel);
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", showCurrentView);
  showCurrentView();

  projectScrollButtons.forEach(button => {
    button.addEventListener("click", () => {
      const activeIndex = projectCards.findIndex(card => card.classList.contains("is-active"));
      const nextCard = projectCards[activeIndex + Number(button.dataset.projectScroll)];
      if (!projectTrack || !nextCard) return;

      const targetLeft = nextCard.offsetLeft - (projectTrack.clientWidth - nextCard.offsetWidth) / 2;
      projectTrack.scrollTo({
        left: targetLeft,
        behavior: reducedMotionQuery.matches ? "auto" : "smooth"
      });
    });
  });

  projectTrack?.addEventListener("scroll", updateProjectCarousel, { passive: true });
  window.addEventListener("scroll", () => {
    if (mobileProjectStackQuery.matches) updateProjectCarousel();
  }, { passive: true });
  window.addEventListener("resize", updateProjectCarousel);
  reducedMotionQuery.addEventListener("change", updateProjectCarousel);

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