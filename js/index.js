function toggleMenu() {
  const sidebar = document.getElementById("sidebar-menu");
  const overlay = document.getElementById("menu-overlay");
  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
}
