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

/*
=====================================================
    Validación usuario logueado
=====================================================
*/

// localStorage.clear();

function checkUser() {
  const user = sessionStorage.getItem("user");
  // const clienteId = sessionStorage.getItem("clienteId");
  const isLogged = false;
  const loginLink = document.getElementById("login-link");

  if (!user) {
    isLogged = false;
    console.log("Usuario logueado: " + user);
    const userName = sessionStorage.getItem("user");
    loginLink.textContent = userName;
    loginLink.href = "javascript:void(0)";
  }
  // isLogged = true;
  console.log("Usuario no logueado");
  const userName = sessionStorage.getItem("user");
  loginLink.textContent = userName;
  loginLink.href = "javascript:void(0)";
  // loginLink.style.display = "none";
  loginLink.addEventListener("click", function () {
    Swal.fire({
      title: "¿Quieres Cerrar Sesión?",
      text: "Se cerrará tu sesión actual",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, cerrar sesión!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        Swal.fire({
          title: "¡Sesión Cerrada!",
          text: "Se ha cerrado tú sesión, vuelve pronto.",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  checkUser();
});
