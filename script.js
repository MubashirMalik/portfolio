(function () {
  const main = document.getElementById("main");
  const sections = document.querySelectorAll(".viewport-section");
  const navLinks = document.querySelectorAll(".nav-link");
  const carousels = {};
  const sectionOrder = ["intro", "experience", "education", "projects"];

  const KEY = {
    up: ["ArrowUp", "Numpad8"],
    down: ["ArrowDown", "Numpad2"],
    left: ["ArrowLeft", "Numpad4"],
    right: ["ArrowRight", "Numpad6"],
  };

  function isKey(e, direction) {
    return KEY[direction].includes(e.key);
  }

  function focusMain() {
    main?.focus({ preventScroll: true });
  }

  // ── Section navigation ──
  function showSection(id, { updateHash = true } = {}) {
    if (!sectionOrder.includes(id)) id = "intro";

    sections.forEach((s) => s.classList.toggle("active", s.dataset.section === id));
    navLinks.forEach((l) => l.classList.toggle("active", l.dataset.section === id));

    if (updateHash) {
      history.replaceState(null, "", `#${id}`);
    }

    focusMain();
  }

  const hashId = window.location.hash.replace("#", "");
  showSection(sectionOrder.includes(hashId) ? hashId : "intro", { updateHash: false });

  window.addEventListener("hashchange", () => {
    const id = window.location.hash.replace("#", "") || "intro";
    if (sectionOrder.includes(id)) showSection(id, { updateHash: false });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      showSection(link.dataset.section);
      link.blur();
    });
  });

  // Click anywhere on the page to capture keyboard focus
  document.addEventListener("click", (e) => {
    if (e.target.closest("a, input, textarea, select")) return;
    focusMain();
  });

  // ── Carousel setup ──
  document.querySelectorAll(".carousel-track").forEach((track) => {
    const id = track.dataset.carousel;
    const slides = [...track.querySelectorAll(".carousel-slide")];
    const controls = document.querySelector(`.slide-controls[data-carousel="${id}"]`);
    const dotsContainer = document.querySelector(`.slide-dots[data-carousel="${id}"]`);
    let index = 0;

    if (slides.length === 0) return;

    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
        dot.addEventListener("click", () => goTo(i));
        dotsContainer.appendChild(dot);
      });
    }

    const counterCurrent = controls?.querySelector(".current");
    const counterTotal = controls?.querySelector(".total");
    if (counterTotal) counterTotal.textContent = slides.length;

    function goTo(i) {
      const prev = index;
      index = ((i % slides.length) + slides.length) % slides.length;

      slides.forEach((slide, si) => {
        slide.classList.remove("active", "prev");
        if (si === index) slide.classList.add("active");
        else if (si === prev && si < index) slide.classList.add("prev");
      });

      if (dotsContainer) {
        dotsContainer.querySelectorAll("button").forEach((dot, di) => {
          dot.classList.toggle("active", di === index);
        });
      }

      if (counterCurrent) counterCurrent.textContent = index + 1;
    }

    controls?.querySelector(".prev")?.addEventListener("click", () => goTo(index - 1));
    controls?.querySelector(".next")?.addEventListener("click", () => goTo(index + 1));

    let touchStartX = 0;
    track.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    track.addEventListener(
      "touchend",
      (e) => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 50) goTo(diff < 0 ? index + 1 : index - 1);
      },
      { passive: true }
    );

    carousels[id] = { goTo, getIndex: () => index, track };
    goTo(0);
  });

  function getActiveSectionId() {
    return document.querySelector(".viewport-section.active")?.dataset.section;
  }

  function getActiveCarousel() {
    const sectionId = getActiveSectionId();
    if (sectionId === "experience") return carousels.experience;
    if (sectionId === "projects") return carousels.projects;
    return null;
  }

  // Single keyboard handler — avoids duplicate listeners and focus issues
  document.addEventListener("keydown", (e) => {
    // Don't hijack keys while typing in a form field
    if (e.target.matches("input, textarea, select, [contenteditable]")) return;

    const sectionId = getActiveSectionId();
    const ci = sectionOrder.indexOf(sectionId);
    const carousel = getActiveCarousel();

    if (isKey(e, "left") || isKey(e, "right")) {
      if (!carousel) return;
      e.preventDefault();
      carousel.goTo(carousel.getIndex() + (isKey(e, "right") ? 1 : -1));
      return;
    }

    if (isKey(e, "up") || isKey(e, "down")) {
      e.preventDefault();
      const ni = isKey(e, "down") ? ci + 1 : ci - 1;
      if (ni >= 0 && ni < sectionOrder.length) showSection(sectionOrder[ni]);
    }
  });

  focusMain();
})();

// Obfuscated contact details — assembled at runtime, not in HTML source
(function () {
  const emailLink = document.querySelector(".email-link");
  if (emailLink) {
    const user = emailLink.dataset.user;
    const domain = emailLink.dataset.domain;
    const email = [user, domain].join("@");
    emailLink.querySelector(".email-text").textContent = email;
    emailLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "mai" + "lto:" + email;
    });
  }

  const phoneLink = document.querySelector(".phone-link");
  if (phoneLink) {
    const cc = phoneLink.dataset.cc;
    const num = phoneLink.dataset.num;
    const formatted = `+${cc} ${num.slice(0, 3)}-${num.slice(3, 6)}-${num.slice(6)}`;
    phoneLink.querySelector(".phone-text").textContent = formatted;
    phoneLink.href = `tel:+${cc}${num}`;
  }
})();
