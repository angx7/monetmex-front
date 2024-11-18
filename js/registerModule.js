// console.log("registerModule.js");

// Función para registrar un nuevo cliente
async function register() {
  let nombreCliente = document.getElementById("nombreCliente").value;
  let emailCliente = document.getElementById("txtRegEmail").value;
  let telefono = document.getElementById("telefono").value;
  let passwordCliente = document.getElementById("registerPassword").value;
  const data = {
    nombreCliente,
    emailCliente,
    telefonoCliente: telefono,
    passwordCliente,
  };
  try {
    const response = await fetch("http://localhost:3000/clientes", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Muestra un mensaje de error amigable para el usuario
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${errorData.message}`,
      });
      return;
    }

    const result = await response.json();
    sessionStorage.setItem("user", result.nombreCliente);
    console.log(sessionStorage.getItem("user"));
    // window.location.href = "index.html";
  } catch (error) {
    // Maneja errores inesperados de manera silenciosa
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.",
    });
  }
}

async function login() {
  let email = document.getElementById("txtLogEmail").value;
  let password = document.getElementById("loginPassword").value;

  const data = {
    emailCliente: email,
    passwordCliente: password,
  };

  try {
    const response = await fetch("http://192.168.1.14:3000/clientes/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Muestra un mensaje de error amigable para el usuario
      // alert(`Error: ${errorData.message}`);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${errorData.message}`,
      });
      return;
    }

    const result = await response.json();
    sessionStorage.setItem("user", result.nombreCliente);
    sessionStorage.setItem("clienteId", result.clienteId);
    console.log(sessionStorage.getItem("user"));
    console.log(sessionStorage.getItem("clienteId"));

    const prevPage = sessionStorage.getItem("prevPage");

    if (prevPage && !prevPage.includes("registerPage.html")) {
      window.location.href = prevPage; // Redirigir a la página anterior
    } else {
      window.location.href = "index.html"; // Redirigir al índice si no hay página previa
    }

    // window.location.href = "index.html";
  } catch (error) {
    // Maneja errores inesperados de manera silenciosa

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.",
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Mostar u ocultar contraseña
  // Selecciona todos los íconos de toggle-password
  const togglePasswordIcons = document.querySelectorAll(".toggle-password");
  togglePasswordIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const passwordField = document.querySelector(
        icon.getAttribute("data-target")
      );
      const newType =
        passwordField.getAttribute("type") === "password" ? "text" : "password";
      passwordField.setAttribute("type", newType);
      icon.classList.toggle("fa-eye-slash");
    });
  });
  const inputs = document.querySelectorAll(
    "#txtRegEmail, input[name='txt'], #telefono, #registerPassword, #txtLogEmail, #loginPassword"
  );

  inputs.forEach((input) => {
    input.addEventListener("input", enableSubmitButton);
    input.addEventListener("blur", enableSubmitButton);
  });

  // Llamar a enableSubmitButton al cargar la página para establecer el estado inicial de los botones
  enableSubmitButton();
});

function enableSubmitButton() {
  // Campos del formulario de registro
  const regEmail = document.getElementById("txtRegEmail").value;
  const regName = document.querySelector("input[name='txt']").value;
  const regPhone = document.getElementById("telefono").value;
  const regPassword = document.getElementById("registerPassword").value;
  const registerButton = document.getElementById("registerBtn");
  const regEmailErrorMessage = document.getElementById(
    "error-message-txtRegEmail"
  );
  const regPhoneErrorMessage = document.getElementById(
    "error-message-txtPhone"
  );

  // Habilitar el botón de registro solo si todos los campos están completos y el email y teléfono son válidos
  if (
    validateEmail(regEmail) &&
    regName &&
    validatePhone(regPhone) &&
    regPassword
  ) {
    registerButton.disabled = false; // Habilitar el botón
    regEmailErrorMessage.style.display = "none"; // Ocultar mensaje de error de email
    regPhoneErrorMessage.style.display = "none"; // Ocultar mensaje de error de teléfono
  } else {
    registerButton.disabled = true; // Deshabilitar el botón
    if (!validateEmail(regEmail)) {
      regEmailErrorMessage.style.display = "block"; // Mostrar mensaje de error de email
    } else {
      regEmailErrorMessage.style.display = "none"; // Ocultar mensaje de error de email
    }
    if (!validatePhone(regPhone)) {
      regPhoneErrorMessage.style.display = "block"; // Mostrar mensaje de error de teléfono
    } else {
      regPhoneErrorMessage.style.display = "none"; // Ocultar mensaje de error de teléfono
    }
  }

  // Campos del formulario de inicio de sesión
  const logEmail = document.getElementById("txtLogEmail").value;
  const logPassword = document.getElementById("loginPassword").value;
  const loginButton = document.getElementById("loginBtn");
  const logEmailErrorMessage = document.getElementById(
    "error-message-txtLogEmail"
  );

  // Habilitar el botón de inicio de sesión solo si ambos campos están completos y el email es válido
  if (validateEmail(logEmail) && logPassword) {
    loginButton.disabled = false; // Habilitar el botón
    logEmailErrorMessage.style.display = "none"; // Ocultar mensaje de error
  } else {
    loginButton.disabled = true; // Deshabilitar el botón
    if (!validateEmail(logEmail)) {
      logEmailErrorMessage.style.display = "block"; // Mostrar mensaje de error
    } else {
      logEmailErrorMessage.style.display = "none"; // Ocultar mensaje de error
    }
  }
}

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function validatePhone(phone) {
  return phone.length === 10 && /^\d+$/.test(phone);
}
