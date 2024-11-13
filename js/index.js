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

/*
=====================================================
    Validación de solo numeros
=====================================================
*/

function valideKey(evt) {
  // code is the decimal ASCII representation of the pressed key.
  var code = evt.which ? evt.which : evt.keyCode;

  if (code == 8 || code == 46) {
    // backspace. and point
    return true;
  } else if (code >= 48 && code <= 57) {
    // is a number.
    return true;
  } else {
    // other keys.
    return false;
  }
}
