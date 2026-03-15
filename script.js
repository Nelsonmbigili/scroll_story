(function () {
  "use strict";

  const nav         = document.querySelector(".site-nav");
  const dots        = document.querySelectorAll(".nav-dots .dot");
  const sections    = document.querySelectorAll(".parallax-section");
  const cards       = document.querySelectorAll("[data-animate]");
  const discoverBtn = document.getElementById("discoverBtn");
  const section2    = document.getElementById("page-2");


  if (discoverBtn && section2) {
    discoverBtn.addEventListener("click", function (e) {
      e.preventDefault();


      if ("scrollBehavior" in document.documentElement.style) {
        section2.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {

        const targetY = section2.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    });
  }


  function handleNavScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  }

  window.addEventListener("scroll", handleNavScroll, { passive: true });
  handleNavScroll();

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          dots.forEach((dot) => {
            dot.classList.toggle("active", dot.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    {
      rootMargin: "-42% 0px -42% 0px",
      threshold: 0,
    }
  );

  sections.forEach((sec) => sectionObserver.observe(sec));

  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealChildren(entry.target);
          cardObserver.unobserve(entry.target); 
        }
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12,
    }
  );

  cards.forEach((card) => cardObserver.observe(card));


  function revealChildren(card) {
    const children = card.querySelectorAll(
      ".detail-item, .step, .addon-card"
    );

    children.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(12px)";
      el.style.transition = `opacity 0.45s ease ${0.3 + i * 0.09}s,
                             transform 0.45s ease ${0.3 + i * 0.09}s`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
      });
    });
  }


  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(dot.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
  let ticking = false;

  function applyParallaxNudge() {
    const vh = window.innerHeight;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();

      if (rect.bottom < 0 || rect.top > vh) return;

      const card = section.querySelector(".content-card");
      if (!card || !card.classList.contains("is-visible")) return;

      const progress = -rect.top / (rect.height + vh);
      const nudge = progress * 28; 

      card.style.transform = `translateY(${nudge}px)`;
    });

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(applyParallaxNudge);
        ticking = true;
      }
    },
    { passive: true }
  );


  const finalSection = document.querySelector("#section6");
  const finalIcons   = document.querySelectorAll(".final-icons span");
  let iconsFired = false;

  if (finalSection && finalIcons.length) {
    const iconObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !iconsFired) {
            iconsFired = true;

            finalIcons.forEach((icon, i) => {
              icon.style.opacity   = "0";
              icon.style.transform = "scale(0.3) rotate(-10deg)";
              icon.style.transition = `
                opacity 0.5s ease ${0.55 + i * 0.1}s,
                transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.55 + i * 0.1}s
              `;

              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  icon.style.opacity   = "0.9";
                  icon.style.transform = "scale(1) rotate(0deg)";
                });
              });
            });

            iconObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    iconObserver.observe(finalSection);
  }

})();
