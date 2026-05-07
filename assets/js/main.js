// main.js — header, mobile nav, smooth scroll, year stamp, page-load progress
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Page-load progress bar
  const bar = document.querySelector(".page-progress");
  if (bar) {
    let p = 0;
    const tick = () => {
      p = Math.min(p + Math.random() * 12, 92);
      bar.style.transform = `scaleX(${p / 100})`;
    };
    const intv = setInterval(tick, 120);
    addEventListener("load", () => {
      clearInterval(intv);
      bar.style.transform = "scaleX(1)";
      setTimeout(() => bar.style.opacity = "0", 240);
      setTimeout(() => bar.remove(), 600);
    });
  }

  // 2. Sticky header scroll-state
  const header = document.querySelector(".site-header");
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    if (header) header.classList.toggle("scrolled", y > 8);
    lastY = y;
  };
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  // 3. Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const closeNav = () => document.body.classList.remove("nav-open");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", document.body.classList.contains("nav-open"));
    });
    document.querySelectorAll(".nav-primary a").forEach(a => a.addEventListener("click", closeNav));
    addEventListener("resize", () => { if (innerWidth > 920) closeNav(); });
  }

  // 4. Mark current page link active
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-primary a").forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;
    if (href === path || (path === "" && href === "index.html") || (path === "index.html" && href === "./")) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  // 5. Year stamp
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  // 6. Smooth in-page anchor scroll honoring reduced-motion + sticky header offset
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id === "#" || id.length < 2) return;
    const tgt = document.querySelector(id);
    if (!tgt) return;
    e.preventDefault();
    const top = tgt.getBoundingClientRect().top + scrollY - 80;
    if (reduced) scrollTo(0, top);
    else scrollTo({ top, behavior: "smooth" });
  });

  // 7. Copy-to-clipboard
  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const v = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(v);
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
        setTimeout(() => { btn.innerHTML = orig; }, 1600);
      } catch (_) {}
    });
  });

  // Expose for other modules
  window.__bs = { reduced };
})();
