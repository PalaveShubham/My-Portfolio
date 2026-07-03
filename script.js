/* ==========================================================================
   Shubham Palave — Portfolio Script
   Handles: loading screen, sticky nav, mobile menu, typing animation,
   scroll reveal, animated counters, scroll progress, scroll-to-top,
   and contact form validation.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------------------
     1. LOADING SCREEN
     --------------------------------------------------------------------- */
  const loader = document.getElementById("loader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 900);
  });

  /* ---------------------------------------------------------------------
     2. FOOTER YEAR
     --------------------------------------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     3. STICKY NAVBAR + SCROLL PROGRESS + ACTIVE LINK
     --------------------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const scrollProgress = document.getElementById("scrollProgress");
  const scrollTopBtn = document.getElementById("scrollTop");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  function onScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Sticky navbar background
    navbar.classList.toggle("scrolled", scrollY > 40);

    // Scroll progress bar
    scrollProgress.style.width = `${(scrollY / docHeight) * 100}%`;

    // Scroll-to-top visibility
    scrollTopBtn.classList.toggle("visible", scrollY > 500);

    // Active nav link based on section in view
    let currentSection = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      if (scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active-link", link.dataset.section === currentSection);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------------
     4. MOBILE MENU
     --------------------------------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("open");
    document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
  });

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* ---------------------------------------------------------------------
     5. TYPING ANIMATION (Hero role)
     --------------------------------------------------------------------- */
  const roles = [
    "Frontend Developer",
    "Junior Full Stack Developer",
    "Problem Solver",
    "Lifelong Learner"
  ];
  const typedEl = document.getElementById("typedRole");
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typedEl.textContent = currentRole.substring(0, charIndex);

    let speed = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === currentRole.length) {
      speed = 1600; // pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 400;
    }

    setTimeout(typeLoop, speed);
  }
  typeLoop();

  /* ---------------------------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS
     --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll("[data-reveal], .project-card");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  // Stagger project card reveal slightly for a nicer cascade
  document.querySelectorAll(".projects-grid .project-card").forEach((card, i) => {
    card.style.transitionDelay = `${i * 90}ms`;
  });

  /* ---------------------------------------------------------------------
     7. ANIMATED COUNTERS
     --------------------------------------------------------------------- */
  const counters = document.querySelectorAll(".counter");

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(update);
  }

  /* ---------------------------------------------------------------------
     8. SCROLL TO TOP
     --------------------------------------------------------------------- */
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------------------------------------------------------------------
     9. CONTACT FORM VALIDATION + SUBMIT
     --------------------------------------------------------------------- */
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formSuccess = document.getElementById("formSuccess");

  const fields = {
    name: { el: document.getElementById("name"), error: document.getElementById("nameError") },
    email: { el: document.getElementById("email"), error: document.getElementById("emailError") },
    subject: { el: document.getElementById("subject"), error: document.getElementById("subjectError") },
    message: { el: document.getElementById("message"), error: document.getElementById("messageError") },
  };

  function validateField(key) {
    const { el, error } = fields[key];
    const value = el.value.trim();
    let message = "";

    if (!value) {
      message = "This field is required.";
    } else if (key === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) message = "Please enter a valid email address.";
    } else if (key === "message" && value.length < 10) {
      message = "Message should be at least 10 characters.";
    }

    error.textContent = message;
    el.closest(".form-group").classList.toggle("invalid", Boolean(message));
    return !message;
  }

  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener("blur", () => validateField(key));
    fields[key].el.addEventListener("input", () => {
      if (fields[key].el.closest(".form-group").classList.contains("invalid")) {
        validateField(key);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const allValid = Object.keys(fields)
      .map((key) => validateField(key))
      .every(Boolean);

    if (!allValid) return;

    // Simulate submission (replace with a real backend / email service
    // such as EmailJS, Formspree, or a custom API endpoint in production).
    submitBtn.disabled = true;
    const btnText = submitBtn.querySelector(".btn-text");
    const originalHTML = btnText.innerHTML;
    btnText.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;

    setTimeout(() => {
      formSuccess.classList.add("show");
      form.reset();
      submitBtn.disabled = false;
      btnText.innerHTML = originalHTML;

      setTimeout(() => formSuccess.classList.remove("show"), 5000);
    }, 1200);
  });

});
