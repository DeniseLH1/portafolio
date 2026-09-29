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
});