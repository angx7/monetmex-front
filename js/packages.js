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

function confirmarCompra(paqueteId) {
  const clienteId = sessionStorage.getItem("clienteId");
  console.log(paqueteId);
  console.log(clienteId);

  Swal.fire({
    title: "Confirmar Compra",
    text: "¿Estás seguro de que deseas comprar este paquete?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "¡Sí, comprar!",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      comprarPaquete(clienteId, paqueteId);
    }
  });
}

function comprarPaquete(clienteId, paqueteId) {
  console.log("Comprando paquete...");
  console.log(clienteId);
  console.log(paqueteId);
  // Realizar la petición al servidor
  fetch(`http://localhost:3000/paquetes/comprar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clienteId, paqueteId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al comprar el paquete");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      Swal.fire({
        title: "¡Compra Exitosa!",
        text: "Se ha realizado la compra del paquete.",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    });
}
