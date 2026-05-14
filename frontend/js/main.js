/* =============================================
   LEARNHUB — main.js
   Homepage interactions
   ============================================= */

// Scroll header shadow
window.addEventListener("scroll", () => {
  const header = document.getElementById("site-header");
  if (header) {
    header.style.borderBottomColor = window.scrollY > 10
      ? "rgba(255,255,255,0.12)"
      : "rgba(255,255,255,0.07)";
  }
});