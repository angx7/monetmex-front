// console.log("registerModule.js");

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
});

function validateEmail(emailId) {
  let email = document.getElementById(emailId).value;
  const errorMessage = document.getElementById("error-message-" + emailId);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex para validar el correo
  if (!emailRegex.test(email)) {
    errorMessage.style.display = "block"; // Muestra el mensaje de error si no es válido
  } else {
    errorMessage.style.display = "none"; // Oculta el mensaje de error si es válido
  }
}
