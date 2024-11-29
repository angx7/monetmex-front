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
  // Realizar la petición al servidor
  fetch(`https://104.236.112.158:3000/paquetes/comprar`, {
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
      Swal.fire({
        title: "¡Pedido Exitoso!",
        text: "Tienes 24 horas para hacer el depósito.\nCuenta: 25605288882\nClabe:044237256052888824\nBeneficiario: Christian Barzallo Mexicano.",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    });
}
