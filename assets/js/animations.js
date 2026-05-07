// animations.js — scroll reveals, headline stagger, marquee duplicate, tilt, lightbox, cursor
(() => {
  const reduced = window.__bs?.reduced ?? matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. IntersectionObserver reveals
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    document.querySelectorAll(".reveal-up, .reveal-fade, .reveal-scale, .reveal-stagger, .path-draw").forEach(el => io.observe(el));
  } else {
    document.querySelectorAll(".reveal-up, .reveal-fade, .reveal-scale, .reveal-stagger, .path-draw").forEach(el => el.classList.add("in"));
  }

  // 2. Headline letter-stagger (only if .headline-stagger present)
  document.querySelectorAll(".headline-stagger").forEach((el) => {
    if (reduced) return;
    const text = el.getAttribute("data-text") || el.textContent.trim();
    el.innerHTML = "";
    const words = text.split(" ");
    let i = 0;
    words.forEach((w, wi) => {
      const wsp = document.createElement("span");
      wsp.className = "word";
      [...w].forEach((c) => {
        const csp = document.createElement("span");
        csp.className = "char";
        csp.textContent = c;
        csp.style.animationDelay = (i++ * 28 + 80) + "ms";
        wsp.appendChild(csp);
      });
      el.appendChild(wsp);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  });

  // 3. Marquee — duplicate track for seamless loop
  document.querySelectorAll(".marquee-track").forEach(track => {
    if (track.dataset.dup === "1") return;
    track.innerHTML += track.innerHTML;
    track.dataset.dup = "1";
  });

  // 4. Tilt (vanilla, RAF-throttled)
  const tilts = document.querySelectorAll("[data-tilt]");
  if (tilts.length && !reduced && matchMedia("(hover: hover)").matches) {
    tilts.forEach(el => {
      let raf;
      const reset = () => {
        el.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateZ(0)";
      };
      el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateZ(0)`;
        });
      });
      el.addEventListener("mouseleave", reset);
      reset();
    });
  }

  // 5. Floating dots mouse parallax (hero)
  const heroParallax = document.querySelector("[data-parallax-host]");
  if (heroParallax && !reduced && matchMedia("(hover: hover)").matches) {
    const dots = heroParallax.querySelectorAll(".dot-floater");
    let tx = 0, ty = 0, cx = 0, cy = 0;
    heroParallax.addEventListener("mousemove", e => {
      const r = heroParallax.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 30;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 18;
    });
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      dots.forEach((d, i) => {
        const k = (i + 1) * 0.6;
        d.style.transform = `translate3d(${(cx * k).toFixed(2)}px, ${(cy * k).toFixed(2)}px, 0)`;
      });
      requestAnimationFrame(tick);
    };
    tick();
  }

  // 6. Lightbox (delegated)
  let lb = null;
  const ensureLb = () => {
    if (lb) return lb;
    lb = document.createElement("div");
    lb.className = "lb-backdrop";
    lb.innerHTML = '<button class="lb-close" aria-label="Close">✕</button><figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(lb);
    lb.addEventListener("click", e => {
      if (e.target === lb || e.target.closest(".lb-close")) {
        lb.classList.remove("open");
        document.body.classList.remove("no-scroll");
      }
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") { lb.classList.remove("open"); document.body.classList.remove("no-scroll"); } });
    return lb;
  };
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-lightbox]");
    if (!t) return;
    e.preventDefault();
    const src = t.getAttribute("data-src") || t.querySelector("img")?.src;
    const cap = t.getAttribute("data-caption") || "";
    const el = ensureLb();
    el.querySelector("img").src = src;
    el.querySelector("figcaption").textContent = cap;
    el.classList.add("open");
    document.body.classList.add("no-scroll");
  });

  // 7. Custom cursor (desktop only, opt-in via body[data-cursor])
  const wantCursor = document.body.dataset.cursor === "on";
  if (wantCursor && !reduced && matchMedia("(hover: hover) and (min-width: 992px)").matches) {
    const dot = document.createElement("div"); dot.className = "cursor-dot"; document.body.appendChild(dot);
    const ring = document.createElement("div"); ring.className = "cursor-ring"; document.body.appendChild(ring);
    document.body.classList.add("has-cursor");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`; });
    const tick = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    };
    tick();
    const interactive = "a, button, input, textarea, select, [data-tilt], [data-lightbox]";
    document.addEventListener("mouseover", e => { if (e.target.closest(interactive)) document.body.classList.add("cursor-hovering"); });
    document.addEventListener("mouseout", e => { if (e.target.closest(interactive)) document.body.classList.remove("cursor-hovering"); });
  }

  // 8. SVG path-draw helper — sets --len based on path length
  document.querySelectorAll(".path-draw").forEach(p => {
    if (typeof p.getTotalLength === "function") {
      const len = Math.ceil(p.getTotalLength());
      p.style.setProperty("--len", len);
    }
  });
})();
