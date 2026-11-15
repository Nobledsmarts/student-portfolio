// Shared behaviour for every page: mobile menu, active link, footer year.

// ----- Mobile navigation toggle (event handling) -----
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#nav");

if (toggle && nav) {
  toggle.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.textContent = isOpen ? "Close" : "Menu";
  });
}

// ----- Mark the link for the current page -----
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav a").forEach(function (link) {
  if (link.getAttribute("href") === currentPage) {
    link.setAttribute("aria-current", "page");
  }
});

// ----- Dynamic footer year -----
const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}
