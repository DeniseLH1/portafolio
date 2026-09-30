document.addEventListener("DOMContentLoaded", () => {
  const views = [...document.querySelectorAll("[data-page-view]")];
  const navigationLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];

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
    copyEmailLabel.textContent = copied ? "¡Copiado!" : "No se pudo copiar";
    copyEmailStatus.textContent = copied
      ? "Correo copiado al portapapeles."
      : "No se pudo copiar el correo. Inténtalo de nuevo.";

    copyFeedbackTimeout = window.setTimeout(() => {
      copyEmailLabel.textContent = "Correo";
      copyEmailStatus.textContent = "";
    }, 2000);
  });
});