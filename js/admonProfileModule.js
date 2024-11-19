document.addEventListener("DOMContentLoaded", () => {
  console.log("admonProfileModule.js cargado");

  // Referencias a los elementos del DOM
  const purchasesTableBody = document.getElementById("purchase-list-items"); // Aquí cambiamos el id
  const filterButton = document.getElementById("search-purchase-btn"); // Cambiado a 'search-purchase-btn'
  const filterInput = document.getElementById("search-purchase-id"); // Cambiado a 'search-purchase-id'
  const clearFilterButton = document.getElementById("clear-filter-btn"); // Cambiado a 'clear-filter-btn'
  const apiUrl = "http://localhost:3000/admon/estado"; // Reemplaza con tu URL real

  // Función para cargar compras desde la API
  const loadPurchases = async (filterId = null) => {
    try {
      let url = apiUrl;
      if (filterId) {
        url += `/${filterId}`; // Filtrar por ID
      }

      console.log("URL:", url);

      const response = await fetch(url);
      const purchases = filterId
        ? [await response.json()] // API devuelve objeto si filtras por ID
        : await response.json(); // API devuelve lista si no se filtra

      // Filtrar solo las compras pendientes si no se filtra por ID
      const filteredPurchases = filterId
        ? purchases
        : purchases.filter((purchase) => purchase.estado === "pendiente");

      renderPurchases(filteredPurchases);
    } catch (error) {
      console.error("Error cargando las compras:", error);
    }
  };

  // Función para renderizar las compras en tarjetas
  const renderPurchases = (purchases) => {
    purchasesTableBody.innerHTML = ""; // Limpiar la tabla
    const purchaseList = document.getElementById("purchase-list-items");
    purchaseList.innerHTML = ""; // Limpiar las tarjetas previas

    if (purchases.length === 0) {
      purchaseList.innerHTML = "<p>No se encontraron compras pendientes</p>";
      return;
    }

    purchases.forEach((purchase, index) => {
      const card = document.createElement("div");
      card.classList.add("col"); // Ajusta el tamaño de las tarjetas -md-3", "mb-3

      card.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${purchase.nombrePaquete}</h5>
            <p class="card-text">Estado: <strong>${purchase.estado}</strong></p>
            <p class="card-text">Fecha de Creación: ${new Date(
              purchase.fechaCreacion
            ).toLocaleString()}</p>
            <p class="card-text">ID de Solicitud: ${
              purchase.clientePaqueteId
            }</p>
            <p class="card-text">Sesiones Restantes: ${
              purchase.sesionesRestantes || "N/A"
            }</p>
            <div class="d-grid gap-2">
              ${
                purchase.estado === "pendiente"
                  ? `<button class="btn btn-success btn-sm approve-button" data-id="${purchase.clientePaqueteId}">Aprobar</button>`
                  : ""
              }
            </div>
          </div>
        </div>
      `;
      purchaseList.appendChild(card);

      // Añadir evento al botón de aprobar
      const approveButton = card.querySelector(".approve-button");
      if (approveButton) {
        approveButton.addEventListener("click", () => {
          const purchaseId = approveButton.dataset.id;
          approvePurchase(purchaseId); // Llamar la función de aprobación
        });
      }
    });
  };

  // Función para aprobar una compra
  const approvePurchase = async (purchaseId) => {
    try {
      const response = await fetch(`${apiUrl}/${purchaseId}/approve`, {
        method: "POST",
      });

      if (response.ok) {
        Swal.fire("Éxito", "Compra aprobada exitosamente.", "success");
        loadPurchases(); // Recargar la tabla
      } else {
        Swal.fire("Error", "No se pudo aprobar la compra.", "error");
      }
    } catch (error) {
      console.error("Error al aprobar la compra:", error);
      Swal.fire("Error", "Hubo un problema al aprobar la compra.", "error");
    }
  };

  // Event Listener para filtrar por ID
  filterButton.addEventListener("click", () => {
    const filterId = filterInput.value.trim();
    if (filterId) {
      loadPurchases(filterId); // Llamamos a loadPurchases con el ID de filtro
    } else {
      Swal.fire(
        "Atención",
        "Por favor, introduce un ID para filtrar.",
        "warning"
      );
    }
  });

  // Event Listener para limpiar filtro
  clearFilterButton.addEventListener("click", () => {
    filterInput.value = "";
    loadPurchases(); // Cargar todas las compras pendientes
  });

  // Cargar las compras pendientes al inicio
  loadPurchases();
});
