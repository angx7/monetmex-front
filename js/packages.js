document.addEventListener("DOMContentLoaded", function () {
  const packageLinks = document.querySelectorAll(".package-link");

  packageLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      const user = sessionStorage.getItem("user");
      if (!user) {
        event.preventDefault(); // Evita la navegación
        Swal.fire({
          title: "Inicio de Sesión Necesario!",
          text: "Por favor, inicia sesión.",
          icon: "warning",
        });
      }
    });
  });
});

function confirmarCompra(packageId) {
  console.log(packageId);
  const userId = getUserId(); // Asume que tienes una función para obtener el ID del usuario

  //   fetch("/api/comprar", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       userId: userId,
  //       packageId: packageId,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.success) {
  //         Swal.fire(
  //           "Compra exitosa",
  //           "Tu compra ha sido realizada con éxito",
  //           "success"
  //         );
  //       } else {
  //         Swal.fire("Error", "Hubo un problema con tu compra", "error");
  //       }
  //     })
  //     .catch((error) => {
  //       Swal.fire("Error", "Hubo un problema con tu compra", "error");
  //     });
}

function getUserId() {
  // Implementa esta función para obtener el ID del usuario
  return "usuario123"; // Ejemplo
}
