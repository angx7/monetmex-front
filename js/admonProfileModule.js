document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el perfil es de un administrador
  const userProfile = sessionStorage.getItem("userType");
  if (userProfile !== "admin") {
    Swal.fire(
      "Acceso denegado",
      "No tienes permisos para acceder a esta página.",
      "error"
    ).then(() => {
      window.location.href = "/"; // Redirigir al login o a otra página
    });
    return; // Detener la ejecución del script
  }
  console.log("admonProfileModule.js cargado");

  // Referencias a los elementos del DOM para compras de paquetes
  const purchasesTableBody = document.getElementById("purchase-list-items");
  const filterButton = document.getElementById("search-purchase-btn");
  const filterInput = document.getElementById("search-purchase-id");
  const clearPackageFilterButton = document.getElementById("clear-filter-btn"); // Limpiar filtro de paquetes

  // Referencias a los elementos del DOM para compras de clases
  const classPurchaseTableBody = document.getElementById(
    "student-package-table"
  );
  const classFilterButton = document.getElementById("filter-button");
  const classFilterInput = document.getElementById("filter-id");
  const clearClassFilterButton = document.getElementById(
    "clear-class-filter-btn"
  ); // Limpiar filtro de clases
  // console.log(clearClassFilterButton); // Asegúrate de que no sea null

  // URLs para las APIs
  const packageApiUrl = "http://localhost:3000/admon/estado";
  const classApiUrl = "http://localhost:3000/admon/clases";

  // Función para cargar las compras de paquetes
  const loadPurchases = async (filterId = null) => {
    try {
      let url = packageApiUrl;
      if (filterId) {
        url += `/${filterId}`;
      }

      const response = await fetch(url);
      const purchases = filterId
        ? [await response.json()]
        : await response.json();
      const filteredPurchases = filterId
        ? purchases
        : purchases.filter((purchase) => purchase.estado === "pendiente");

      renderPurchases(filteredPurchases);
    } catch (error) {
      console.error("Error cargando las compras de paquetes:", error);
    }
  };

  // Función para renderizar las compras de paquetes
  const renderPurchases = (purchases) => {
    purchasesTableBody.innerHTML = "";

    if (purchases.length === 0) {
      purchasesTableBody.innerHTML =
        "<p>No se encontraron compras pendientes</p>";
      return;
    }

    purchases.forEach((purchase) => {
      const card = document.createElement("div");
      card.classList.add("col");

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
      purchasesTableBody.appendChild(card);

      const approveButton = card.querySelector(".approve-button");
      if (approveButton) {
        approveButton.addEventListener("click", () => {
          const purchaseId = approveButton.dataset.id;
          approvePurchase(purchaseId);
        });
      }
    });
  };

  // Función para aprobar una compra de paquete
  const approvePurchase = async (purchaseId) => {
    try {
      const response = await fetch(`${packageApiUrl}/${purchaseId}/approve`, {
        method: "POST",
      });

      if (response.ok) {
        Swal.fire("Éxito", "Compra aprobada exitosamente.", "success");
        loadPurchases();
      } else {
        Swal.fire("Error", "No se pudo aprobar la compra.", "error");
      }
    } catch (error) {
      console.error("Error al aprobar la compra:", error);
      Swal.fire("Error", "Hubo un problema al aprobar la compra.", "error");
    }
  };

  // Función para cargar las compras de clases
  const loadClassPurchases = async (filterId = null) => {
    try {
      let url = classApiUrl;
      if (filterId) {
        url += `/${filterId}`;
      }

      const response = await fetch(url);
      const classPurchases = filterId
        ? [await response.json()]
        : await response.json();
      renderClassPurchases(classPurchases);
    } catch (error) {
      console.error("Error cargando las compras de clases:", error);
    }
  };

  // Función para renderizar las compras de clases
  const renderClassPurchases = (classPurchases) => {
    classPurchaseTableBody.innerHTML = "";

    if (classPurchases.length === 0) {
      classPurchaseTableBody.innerHTML =
        "<p>No se encontraron compras pendientes de clases</p>";
      return;
    }

    classPurchases.forEach((purchase) => {
      console.log(purchase);
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${purchase.id}</td>
        <td>${purchase.nombreCliente}</td>
        <td>${purchase.metodoPago}</td>
        <td>${purchase.estadoPago}</td>
        <td>${new Date(purchase.fechaCreacion).toLocaleString()}</td>
        <td>
          ${
            purchase.estadoPago === "pendiente"
              ? `<button class="btn btn-success btn-sm approve-button" data-id="${purchase.id}">Aprobar</button>`
              : ""
          }
        </td>
      `;
      classPurchaseTableBody.appendChild(row);

      const approveButton = row.querySelector(".approve-button");
      if (approveButton) {
        approveButton.addEventListener("click", () => {
          const purchaseId = approveButton.dataset.id;
          approveClassPurchase(purchaseId);
        });
      }
    });
  };

  // Función para aprobar una compra de clase
  const approveClassPurchase = async (purchaseId) => {
    try {
      const response = await fetch(`${classApiUrl}/${purchaseId}/approve`, {
        method: "POST",
      });

      if (response.ok) {
        Swal.fire("Éxito", "Compra de clase aprobada exitosamente.", "success");
        loadClassPurchases();
      } else {
        Swal.fire("Error", "No se pudo aprobar la compra de clase.", "error");
      }
    } catch (error) {
      console.error("Error al aprobar la compra de clase:", error);
      Swal.fire(
        "Error",
        "Hubo un problema al aprobar la compra de clase.",
        "error"
      );
    }
  };

  // Event listeners para filtrar por ID de compra (Paquetes)
  filterButton.addEventListener("click", () => {
    const filterId = filterInput.value.trim();
    if (filterId) {
      loadPurchases(filterId);
    } else {
      Swal.fire(
        "Atención",
        "Por favor, introduce un ID para filtrar.",
        "warning"
      );
    }
  });

  // Event listeners para filtrar por ID de compra (Clases)
  classFilterButton.addEventListener("click", () => {
    const filterId = classFilterInput.value.trim();
    if (filterId) {
      loadClassPurchases(filterId);
    } else {
      Swal.fire(
        "Atención",
        "Por favor, introduce un ID para filtrar.",
        "warning"
      );
    }
  });

  // Event listener para limpiar filtro de compras de paquetes
  clearPackageFilterButton.addEventListener("click", () => {
    console.log("Limpiando filtro de compras de clases");
    classFilterInput.value = "";
    loadClassPurchases();
  });

  // Event listener para limpiar filtro de compras de clases
  clearClassFilterButton.addEventListener("click", () => {
    filterInput.value = "";
    loadPurchases();
  });

  // Cargar compras de paquetes y clases al inicio
  loadPurchases();
  loadClassPurchases();
});
