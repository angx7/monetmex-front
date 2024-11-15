// console.log("registerModule.js");

// Función para registrar un nuevo cliente
async function register() {
  console.log("register");
}

async function login() {
  let email = document.getElementById("txtLogEmail").value;
  let password = document.getElementById("loginPassword").value;

  const data = {
    emailCliente: email,
    passwordCliente: password,
  };

  try {
    const response = await fetch("http://localhost:3000/clientes/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Muestra un mensaje de error amigable para el usuario
      alert(`Error: ${errorData.message}`);
      return;
    }

    const result = await response.json();
    sessionStorage.setItem("user", result.nombreCliente);
    console.log(sessionStorage.getItem("user"));
    window.location.href = "index.html";
  } catch (error) {
    // Maneja errores inesperados de manera silenciosa
    alert(
      "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde."
    );
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

  // Validar formulario de login
  // const logEmailInput = document.getElementById("txtLogEmail");
  // const logPasswordInput = document.getElementById("loginPassword");

  // logEmailInput.addEventListener("input", enableLoginButton);
  // logEmailInput.addEventListener("blur", enableLoginButton);
  // logPasswordInput.addEventListener("input", enableLoginButton);
  // logPasswordInput.addEventListener("blur", enableLoginButton);

  const inputs = document.querySelectorAll(
    "#txtRegEmail, input[name='txt'], #telefono, #registerPassword, #txtLogEmail, #loginPassword"
  );

  inputs.forEach((input) => {
    input.addEventListener("input", enableSubmitButton);
    input.addEventListener("blur", enableSubmitButton);
  });

  // Llamar a enableSubmitButton al cargar la página para establecer el estado inicial de los botones
  enableSubmitButton();

  // Llamar a enableLoginButton al cargar la página para establecer el estado inicial del botón
  // enableLoginButton();
});

// function enableLoginButton() {
//   const logEmail = document.getElementById("txtLogEmail").value;
//   const logPassword = document.getElementById("loginPassword").value;
//   const loginButton = document.getElementById("loginBtn");
//   const emailErrorMessage = document.getElementById(
//     "error-message-txtLogEmail"
//   );

//   if (validateEmail(logEmail) && logPassword) {
//     loginButton.disabled = false; // Habilitar el botón
//     emailErrorMessage.style.display = "none"; // Ocultar mensaje de error
//   } else {
//     loginButton.disabled = true; // Deshabilitar el botón
//     if (!validateEmail(logEmail)) {
//       emailErrorMessage.style.display = "block"; // Mostrar mensaje de error
//     } else {
//       emailErrorMessage.style.display = "none"; // Ocultar mensaje de error
//     }
//   }
// }

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

// function validateEmail(emailId) {
//   let email = document.getElementById(emailId).value;
//   const errorMessage = document.getElementById("error-message-" + emailId);

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex para validar el correo
//   if (!emailRegex.test(email)) {
//     errorMessage.style.display = "block"; // Muestra el mensaje de error si no es válido
//   } else {
//     errorMessage.style.display = "none"; // Oculta el mensaje de error si es válido
//   }
// }
