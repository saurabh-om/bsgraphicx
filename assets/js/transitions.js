// transitions.js — initial page loader + cross-page transitions for static multi-page site
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MIN_LOADER_MS = reduced ? 0 : 700;
  const EXIT_MS = 320;
  const startedAt = performance.now();

  const finish = () => {
    const elapsed = performance.now() - startedAt;
    const wait = Math.max(0, MIN_LOADER_MS - elapsed);
    setTimeout(() => document.body.classList.add("is-loaded"), wait);
  };

  if (document.readyState === "complete") finish();
  else addEventListener("load", finish);

  // Some browsers cache the unloaded body when navigating back — reset state
  addEventListener("pageshow", (e) => {
    if (e.persisted) {
      document.body.classList.remove("is-leaving");
      document.body.classList.add("is-loaded");
    }
  });

  // Intercept internal links → leave animation → navigate
  document.addEventListener("click", e => {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest("a[href]");
    if (!a) return;
    if (a.target === "_blank") return;
    if (a.hasAttribute("download")) return;
    if (a.hasAttribute("data-no-transition")) return;
    const href = a.getAttribute("href");
    if (!href) return;
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:") || href.startsWith("wa.me") || href.includes("api")) return;
    let url;
    try { url = new URL(href, location.href); } catch { return; }
    if (url.origin !== location.origin) return;
    // same-page anchor → no transition
    if (url.pathname === location.pathname && (url.hash || url.search)) return;

    // If View Transitions are doing their thing natively, the browser handles it.
    if (document.startViewTransition && false) {
      // Cross-document VT is opt-in via @view-transition CSS; we do NOT call startViewTransition here.
    }

    e.preventDefault();
    document.body.classList.remove("is-loaded");
    document.body.classList.add("is-leaving");
    setTimeout(() => { window.location.href = url.href; }, EXIT_MS);
  });
})();
