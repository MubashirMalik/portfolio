(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sectionIds = ["active", "owned", "built", "path", "talk"];
  const indexLinks = [...document.querySelectorAll(".index-link")];

  function setActive(id) {
    indexLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("active", href === `#${id}`);
    });
  }

  // Scroll spy
  const bands = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if ("IntersectionObserver" in window && bands.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.1, 0.25, 0.5] }
    );
    bands.forEach((el) => spy.observe(el));
  }

  // Reveal on scroll
  const reveals = [...document.querySelectorAll(".reveal")];
  if (reduceMotion) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else if ("IntersectionObserver" in window) {
    const revealSpy = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => revealSpy.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // Hero reveals should show shortly after load
  requestAnimationFrame(() => {
    document.querySelectorAll(".hero .reveal").forEach((el) => el.classList.add("is-in"));
  });
})();

// Obfuscated contact details, assembled at runtime, not in HTML source
(function () {
  const emailLink = document.querySelector(".email-link");
  if (emailLink) {
    const user = emailLink.dataset.user;
    const domain = emailLink.dataset.domain;
    const email = [user, domain].join("@");
    const text = emailLink.querySelector(".email-text");
    if (text) text.textContent = email;
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
    const text = phoneLink.querySelector(".phone-text");
    if (text) text.textContent = formatted;
    phoneLink.href = `tel:+${cc}${num}`;
  }
})();
