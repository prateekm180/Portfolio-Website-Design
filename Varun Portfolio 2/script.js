(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Preloader
  --------------------------------------------------------- */
  window.addEventListener("load", () => {
    const pre = document.getElementById("preloader");
    setTimeout(() => pre && pre.classList.add("is-hidden"), 450);
  });

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Custom cursor
  --------------------------------------------------------- */
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const canHover = window.matchMedia("(hover:hover) and (pointer:fine)").matches;

  if (canHover && dot && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();

    document.querySelectorAll("a, button, .skill-panel .tag, .work-card").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });
  }

  /* ---------------------------------------------------------
     Nav: scroll state + active link + mobile toggle
  --------------------------------------------------------- */
  const siteNav = document.getElementById("siteNav");
  const onScrollNav = () => {
    siteNav.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  navToggle.addEventListener("click", () => {
    const open = navToggle.classList.toggle("is-open");
    mobileMenu.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  mobileMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navToggle.classList.remove("is-open");
      mobileMenu.classList.remove("is-open");
    })
  );

  const navAnchors = document.querySelectorAll("[data-nav]");
  const sectionsForNav = ["about", "skills", "work", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sectionsForNav.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navAnchors.forEach((a) => {
              a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sectionsForNav.forEach((s) => navObserver.observe(s));
  }

  /* ---------------------------------------------------------
     Reveal on scroll
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 60}ms`;
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------------------------------------------------------
     Hero role rotator
  --------------------------------------------------------- */
  const roleWords = document.querySelectorAll(".role-word");
  if (roleWords.length) {
    let activeIndex = 0;
    setInterval(() => {
      const current = roleWords[activeIndex];
      const nextIndex = (activeIndex + 1) % roleWords.length;
      const next = roleWords[nextIndex];
      current.classList.remove("is-active");
      current.classList.add("is-leaving");
      next.classList.add("is-active");
      setTimeout(() => current.classList.remove("is-leaving"), 500);
      activeIndex = nextIndex;
    }, 2400);
  }

  /* ---------------------------------------------------------
     Skills tabs
  --------------------------------------------------------- */
  const skillTabs = document.querySelectorAll(".skill-tab");
  skillTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      skillTabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      document.querySelectorAll(".skill-panel").forEach((p) => p.classList.remove("is-active"));
      document.getElementById(tab.dataset.target).classList.add("is-active");
    });
  });

  /* ---------------------------------------------------------
     Work filter
  --------------------------------------------------------- */
  const filterChips = document.querySelectorAll(".filter-chip");
  const workCards = document.querySelectorAll(".work-card");
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      const filter = chip.dataset.filter;
      workCards.forEach((card) => {
        const match = filter === "all" || card.dataset.cat === filter;
        card.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* ---------------------------------------------------------
     3D tilt on project cards
  --------------------------------------------------------- */
  if (canHover && !reducedMotion) {
    document.querySelectorAll(".work-card-inner").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateZ(0)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateY(0deg) rotateX(0deg)";
      });
    });
  }

  /* ---------------------------------------------------------
     Magnetic buttons
  --------------------------------------------------------- */
  if (canHover && !reducedMotion) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0,0)";
      });
    });
  }

  /* ---------------------------------------------------------
     Contact form -> mailto
  --------------------------------------------------------- */
  const form = document.getElementById("contactForm");
  const hint = document.getElementById("formHint");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("cf-name").value.trim();
      const email = document.getElementById("cf-email").value.trim();
      const message = document.getElementById("cf-message").value.trim();
      const subject = encodeURIComponent(`Portfolio message from ${name || "a visitor"}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:varunkumar43256@gmail.com?subject=${subject}&body=${body}`;
      if (hint) hint.textContent = "Opening your email app…";
    });
  }

  /* ---------------------------------------------------------
     Hero neural network canvas
  --------------------------------------------------------- */
  const canvas = document.getElementById("net");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height, dpr;
    let nodes = [];
    const mouse = { x: null, y: null, active: false };
    const hero = document.getElementById("hero");

    const violet = "140,92,255";
    const cyan = "51,230,196";

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    }

    function buildNodes() {
      const density = width < 700 ? 16000 : 9000;
      const count = Math.max(24, Math.min(90, Math.floor((width * height) / density)));
      nodes = new Array(count).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
        c: Math.random() > 0.5 ? violet : cyan,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);
      const linkDist = width < 700 ? 110 : 150;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            const force = (140 - dist) / 140;
            n.x += (dx / dist) * force * 1.1;
            n.y += (dy / dist) * force * 1.1;
          }
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const o = nodes[j];
          const dx = n.x - o.x;
          const dy = n.y - o.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDist) {
            ctx.strokeStyle = `rgba(${n.c}, ${0.16 * (1 - dist / linkDist)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(o.x, o.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.c}, 0.85)`;
        ctx.fill();
      }

      if (!reducedMotion) requestAnimationFrame(step);
    }

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    hero.addEventListener("mouseleave", () => { mouse.active = false; });

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    resize();
    if (reducedMotion) {
      step(); // draw a single static frame
    } else {
      requestAnimationFrame(step);
    }
  }
})();
