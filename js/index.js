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
  const clienteId = sessionStorage.getItem("clienteId");
  const loginLink = document.getElementById("login-link");

  // Verifica si el usuario está logueado
  if (user) {
    console.log("Usuario logueado:", user);
    loginLink.textContent = user; // Muestra el nombre del usuario

    // Agregar enlace de Cerrar Sesión
    const logoutLink = document.createElement("a");
    logoutLink.href = "javascript:void(0)";
    logoutLink.id = "logout-link";
    logoutLink.textContent = "Cerrar Sesión";

    // Añadir el enlace de Cerrar Sesión al menú
    const sidebarMenu = document.getElementById("sidebar-menu");
    sidebarMenu.appendChild(logoutLink);

    // Maneja el clic en el enlace de Cerrar Sesión
    logoutLink.addEventListener("click", () => {
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
          sessionStorage.clear(); // Limpia la sesión
          Swal.fire({
            title: "¡Sesión Cerrada!",
            text: "Se ha cerrado tu sesión, vuelve pronto.",
            icon: "success",
          }).then(() => {
            // Redirige a la página de inicio
            if (
              window.location.pathname === "/profile.html" ||
              window.location.pathname === "/admonProfile.html"
            ) {
              window.location.href = "index.html"; // Redirige a la página principal si está en el perfil
            } else {
              window.location.reload(); // Recarga la página si no está en el perfil
            }
          });
        }
      });
    });

    // Redirige al usuario a su perfil cuando haga clic en su nombre
    loginLink.addEventListener("click", () => {
      window.location.href = "profile.html"; // Redirige a la página de perfil
    });
  } else {
    console.log("Usuario no logueado");
    loginLink.textContent = "Iniciar sesión"; // Muestra el texto de "Iniciar sesión"
  }

  loginLink.href = "javascript:void(0)"; // Previene que redirija directamente

  console.log("ID del cliente:", clienteId);

  // Maneja el clic en el enlace de Iniciar sesión
  loginLink.addEventListener("click", () => {
    if (user) {
      // Si el usuario está logueado, ya redirige al perfil en el evento anterior
    } else {
      // Si el usuario no está logueado, redirige a la página de registro
      window.location.href = "registerPage.html";
    }
  });
}

// Llama a la función checkUser al cargar la página
// document.addEventListener("DOMContentLoaded", checkUser);

document.getElementById("login-link").addEventListener("click", (event) => {
  // Guardar la URL actual antes de redirigir al usuario a la página de registro/inicio de sesión
  sessionStorage.setItem("prevPage", window.location.href);
});

document.addEventListener("DOMContentLoaded", function () {
  checkUser();
});
