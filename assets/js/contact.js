// contact.js — composes a mailto: URL from form fields
(() => {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const phone = (data.get("phone") || "").toString().trim();
    const interest = (data.get("interest") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    const subj = `New enquiry from ${name || "website"}${interest ? ` — ${interest}` : ""}`;
    const body = [
      `Name:     ${name}`,
      `Email:    ${email}`,
      `Phone:    ${phone}`,
      `Service:  ${interest}`,
      "",
      "Message:",
      message,
      "",
      "—",
      "Sent from bsgraphix.com contact form"
    ].join("\n");

    const url = `mailto:bsgraphix1@gmail.com?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;

    // Reassuring inline state (since opening a mail client isn't always obvious)
    const status = document.getElementById("form-status");
    if (status) {
      status.textContent = "Opening your email app… If nothing happens, please email us directly.";
      status.style.color = "var(--brand-navy)";
    }
  });
})();
