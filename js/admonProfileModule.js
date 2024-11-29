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

  // Referencias del DOM para compras de paquetes
  const purchasesTableBody = document.getElementById("purchase-list-items");
  const filterButton = document.getElementById("search-purchase-btn");
  const filterInput = document.getElementById("search-purchase-id");
  const clearPackageFilterButton = document.getElementById("clear-filter-btn");

  // Referencias del DOM para compras de clases
  const classPurchaseTableBody = document.getElementById(
    "student-package-table"
  );
  const classFilterButton = document.getElementById("filter-button");
  const classFilterInput = document.getElementById("filter-id");
  const clearClassFilterButton = document.getElementById(
    "clear-class-filter-btn"
  );

  // Referencias del DOM para asistencia
  const attendanceSelect = document.getElementById("class-select-massive");
  const attendanceTable = document.getElementById("attendance-table");
  const saveButton = document.getElementById("save-attendance");

  // URLs para las APIs
  const packageApiUrl = "https://104.236.112.158:3000/admon/estado";
  const classApiUrl = "https://104.236.112.158:3000/admon/clases";
  const baseUrl = "https://104.236.112.158:3000/admon/asistencia";

  // Referencia del DOM para logout
  const logoutButton = document.getElementById("logout");

  // *** FUNCIONES PARA PAQUETES ***

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
    }
  };

  // *** FUNCIONES PARA CLASES ***

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

  const renderClassPurchases = (classPurchases) => {
    classPurchaseTableBody.innerHTML = "";

    if (classPurchases.length === 0) {
      classPurchaseTableBody.innerHTML =
        "<p>No se encontraron compras pendientes de clases</p>";
      return;
    }

    classPurchases.forEach((purchase) => {
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
    }
  };

  // *** FUNCIONES PARA ASISTENCIA ***

  const loadClasses = async () => {
    try {
      const response = await fetch(`${baseUrl}/horarios`);
      const classes = await response.json();

      attendanceSelect.innerHTML =
        '<option value="" disabled selected>Selecciona una clase</option>';
      classes.forEach((clase) => {
        const option = document.createElement("option");
        option.value = clase.id;
        option.textContent = `${clase.disciplina} - ${clase.diaSemana} - ${clase.horaInicio}`;
        attendanceSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar las clases:", error);
    }
  };

  const loadAttendanceData = async (classId) => {
    try {
      const response = await fetch(`${baseUrl}/${classId}`);
      const attendanceData = await response.json();

      attendanceTable.innerHTML = "";
      attendanceData.forEach((record) => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = record.nombreCliente;
        row.appendChild(nameCell);

        const attendanceCell = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = record.estadoPago === "pagado";
        checkbox.dataset.recordId = record.id;
        attendanceCell.appendChild(checkbox);
        row.appendChild(attendanceCell);

        attendanceTable.appendChild(row);
      });
    } catch (error) {
      console.error("Error al cargar los datos de asistencia:", error);
    }
  };

  const saveAttendance = async () => {
    const classId = attendanceSelect.value;

    if (!classId) {
      Swal.fire("Atención", "Por favor selecciona una clase.", "warning");
      return;
    }

    const attendanceRecords = Array.from(
      document.querySelectorAll("#attendance-table input[type='checkbox']")
    ).map((checkbox) => ({
      id: checkbox.dataset.recordId,
      asistencia: checkbox.checked ? "asistio" : "falto",
    }));

    try {
      const response = await fetch(`${baseUrl}/${classId}/guardar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ asistencia: attendanceRecords }),
      });

      if (response.ok) {
        Swal.fire("Éxito", "Asistencia guardada exitosamente.", "success");
      } else {
        Swal.fire("Error", "No se pudo guardar la asistencia.", "error");
      }
    } catch (error) {
      console.error("Error al guardar la asistencia:", error);
    }
  };

  // *** LISTENERS ***

  filterButton.addEventListener("click", () => {
    const filterId = filterInput.value.trim();
    loadPurchases(filterId);
  });

  clearPackageFilterButton.addEventListener("click", () => {
    filterInput.value = "";
    loadPurchases();
  });

  classFilterButton.addEventListener("click", () => {
    const filterId = classFilterInput.value.trim();
    loadClassPurchases(filterId);
  });

  clearClassFilterButton.addEventListener("click", () => {
    classFilterInput.value = "";
    loadClassPurchases();
  });

  attendanceSelect.addEventListener("change", () => {
    const classId = attendanceSelect.value;
    if (classId) {
      loadAttendanceData(classId);
    }
  });

  saveButton.addEventListener("click", saveAttendance);

  logoutButton.addEventListener("click", () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        window.location.href = "/"; // Redirigir al login
      }
    });
  });

  // *** INICIALIZACIÓN ***

  loadPurchases();
  loadClassPurchases();
  loadClasses();
});
