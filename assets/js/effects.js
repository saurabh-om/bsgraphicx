// effects.js — split-reveal, text scramble, and hero parallax
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------------------
   * (B) SPLIT-REVEAL — clone the heading's inner HTML into top + bottom halves
   * The original stays in place (visibility:hidden) so the layout doesn't shift.
   * ------------------------------------------------------------------------ */
  const splits = document.querySelectorAll(".split-reveal");
  splits.forEach(el => {
    if (el.dataset.srInit === "1") return;
    const html = el.innerHTML;
    el.innerHTML = `<span class="sr-half top" aria-hidden="true">${html}</span>` +
                   `<span class="sr-half bot" aria-hidden="true">${html}</span>` +
                   `<span class="sr-orig">${html}</span>`;
    el.dataset.srInit = "1";
  });

  if ("IntersectionObserver" in window) {
    const splitObs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          splitObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.20, rootMargin: "0px 0px -8% 0px" });
    splits.forEach(el => splitObs.observe(el));
  } else {
    splits.forEach(el => el.classList.add("in"));
  }

  /* --------------------------------------------------------------------------
   * (A) TEXT SCRAMBLE — for elements tagged [data-scramble]. Each visible
   * non-whitespace character cycles through a noise charset and "settles"
   * progressively from left to right. Honors `prefers-reduced-motion`.
   * ------------------------------------------------------------------------ */
  if (!reduced) {
    document.querySelectorAll("[data-scramble]").forEach(el => {
      const textNodes = [];
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      const originals = textNodes.map(n => n.nodeValue);
      const totalChars = originals.reduce((s, t) => s + t.length, 0);
      if (!totalChars) return;
      const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*+=?<>/";
      const startDelay = parseInt(el.getAttribute("data-scramble-delay")) || 280;
      const duration = parseInt(el.getAttribute("data-scramble-dur")) || 1100;
      const t0 = performance.now() + startDelay;

      const tick = (now) => {
        const elapsed = now - t0;
        if (elapsed < 0) { requestAnimationFrame(tick); return; }
        const revealedTo = (elapsed / duration) * totalChars;
        let charIdx = 0;
        let allDone = true;
        for (let ni = 0; ni < textNodes.length; ni++) {
          const orig = originals[ni];
          let out = "";
          for (let i = 0; i < orig.length; i++, charIdx++) {
            const c = orig[i];
            if (/\s/.test(c) || charIdx < revealedTo) {
              out += c;
            } else {
              out += charset[(Math.random() * charset.length) | 0];
              allDone = false;
            }
          }
          textNodes[ni].nodeValue = out;
        }
        if (!allDone) requestAnimationFrame(tick);
        else for (let ni = 0; ni < textNodes.length; ni++) textNodes[ni].nodeValue = originals[ni];
      };
      requestAnimationFrame(tick);
    });
  }

  /* --------------------------------------------------------------------------
   * (G) HERO PARALLAX — applies a transform translateY based on scrollY,
   * scaled by each element's data-parallax="<speed>" value (e.g. 0.10).
   * Stops applying once the element's section is well below the viewport
   * (saves cycles when off-screen).
   * ------------------------------------------------------------------------ */
  const items = [...document.querySelectorAll("[data-parallax]")].map(el => ({
    el,
    speed: parseFloat(el.getAttribute("data-parallax")) || 0.10,
  }));
  if (items.length && !reduced) {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = scrollY;
      for (const { el, speed } of items) {
        // Skip if the element is far below the viewport — nothing to parallax.
        const r = el.getBoundingClientRect();
        if (r.top > innerHeight + 200 || r.bottom < -200) continue;
        const dy = -y * speed;
        el.style.transform = `translate3d(0, ${dy.toFixed(2)}px, 0)`;
      }
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
  }
})();
