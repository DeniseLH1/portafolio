document.addEventListener("DOMContentLoaded", () => {
  const translations = window.portfolioTranslations;
  const languageButtons = [...document.querySelectorAll("[data-set-language]")];
  const views = [...document.querySelectorAll("[data-page-view]")];
  const navigationLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  let currentLanguage = "es";

  try {
    currentLanguage = localStorage.getItem("portfolio-language") === "en" ? "en" : "es";
  } catch {
    currentLanguage = "es";
  }

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

    try {
      localStorage.setItem("portfolio-language", language);
    } catch {
      // The selected language still applies for this page view.
    }
  }

  languageButtons.forEach(button => {
    button.addEventListener("click", () => setLanguage(button.dataset.setLanguage));
  });

  setLanguage(currentLanguage);

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