// function toggleMenu() {
//   const sidebar = document.getElementById("sidebar-menu");
//   const overlay = document.getElementById("menu-overlay");
//   sidebar.classList.toggle("open");
//   overlay.classList.toggle("show");
// }

// function openMenu() {
//   document.getElementById("sidebar").classList.add("show");
// }

// function closeMenu() {
//   document.getElementById("sidebar").classList.remove("show");
// }

function toggleMenu() {
  const sidebarMenu = document.getElementById("sidebar-menu");
  const menuOverlay = document.getElementById("menu-overlay");
  const menuIcon = document.querySelector(".menu-icon");
  const closeIcon = document.querySelector(".close-icon");

  // Alterna la clase activa del menú lateral y del overlay
  sidebarMenu.classList.toggle("active");
  menuOverlay.classList.toggle("active");

  // Alterna la visibilidad entre el icono de menú y el icono de cierre
  if (sidebarMenu.classList.contains("active")) {
    menuIcon.style.display = "none";
    closeIcon.style.display = "inline";
  } else {
    menuIcon.style.display = "inline";
    closeIcon.style.display = "none";
  }
}
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  const sidebarMenu = document.getElementById("sidebar-menu");
  if (window.scrollY > 50 && !sidebarMenu.classList.contains("active")) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
