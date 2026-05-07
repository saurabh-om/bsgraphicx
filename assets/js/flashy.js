// flashy.js — cursor spotlight + scroll progress + magnetic CTAs + floating FAB
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------------------
   * 1. Cursor spotlight on .has-spotlight elements (RAF-throttled, hover-only)
   * ------------------------------------------------------------------------ */
  const spotlights = document.querySelectorAll(".has-spotlight");
  if (spotlights.length && matchMedia("(hover: hover)").matches) {
    spotlights.forEach(el => {
      let raf = 0;
      let pending = null;

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        pending = [e.clientX - r.left, e.clientY - r.top];
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (!pending) return;
          el.style.setProperty("--mx", pending[0] + "px");
          el.style.setProperty("--my", pending[1] + "px");
        });
      };
      const onEnter = () => el.classList.add("is-pointing");
      const onLeave = () => {
        el.classList.remove("is-pointing");
        el.style.setProperty("--mx", "-200px");
        el.style.setProperty("--my", "-200px");
      };
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
    });
  }

  /* --------------------------------------------------------------------------
   * 2. Scroll progress bar
   * ------------------------------------------------------------------------ */
  const bar = document.querySelector(".scroll-progress");
  if (bar) {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - innerHeight;
      const p = h > 0 ? (scrollY / h) * 100 : 0;
      bar.style.setProperty("--p", p.toFixed(2) + "%");
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
  }

  /* --------------------------------------------------------------------------
   * 3. Magnetic CTAs — apply attraction translate to .btn-magnetic on hover
   * ------------------------------------------------------------------------ */
  if (!reduced && matchMedia("(hover: hover) and (min-width: 720px)").matches) {
    document.querySelectorAll(".btn-magnetic").forEach(el => {
      let raf = 0;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) * 0.25;
        const dy = (e.clientY - cy) * 0.30;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
        });
      };
      const reset = () => {
        if (raf) cancelAnimationFrame(raf), raf = 0;
        el.style.transform = "";
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", reset);
    });
  }

  /* --------------------------------------------------------------------------
   * 4. Floating chat FAB — appear after scroll, fan out, hide near footer
   * ------------------------------------------------------------------------ */
  const fab = document.querySelector(".floating-fab");
  if (fab) {
    const main = fab.querySelector(".fab-main");
    main?.addEventListener("click", () => {
      fab.classList.toggle("open");
      main.setAttribute("aria-expanded", fab.classList.contains("open"));
    });
    document.addEventListener("click", (e) => {
      if (!fab.classList.contains("open")) return;
      if (!fab.contains(e.target)) fab.classList.remove("open");
    });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape") fab.classList.remove("open");
    });

    let raf = 0;
    const recalc = () => {
      raf = 0;
      const visible = scrollY > 300;
      fab.classList.toggle("visible", visible);
      // hide when near the footer
      const footer = document.querySelector(".site-footer");
      if (footer && visible) {
        const fr = footer.getBoundingClientRect();
        const nearFooter = fr.top < innerHeight - 80;
        fab.classList.toggle("near-footer", nearFooter);
      }
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(recalc); };
    recalc();
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
  }
})();
