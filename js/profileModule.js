// Obtener un saludo dinámico basado en la hora del día
function obtenerSaludo() {
  const nombreUsuario = sessionStorage.getItem("user") || "Usuario";
  const hora = new Date().getHours();
  if (hora < 6)
    return `¡Hola, ${nombreUsuario}! Espero que tengas una noche tranquila.`;
  if (hora < 12) return `¡Buenos días, ${nombreUsuario}!`;
  if (hora < 18) return `¡Buenas tardes, ${nombreUsuario}!`;
  return `¡Buenas noches, ${nombreUsuario}!`;
}

// Llamada a la API para obtener paquetes
async function obtenerPaquetes() {
  const clienteId = sessionStorage.getItem("clienteId");
  if (!clienteId) {
    console.error("No se encontró el ID del cliente en el sessionStorage.");
    return [];
  }

  try {
    const response = await fetch(`https://monetback.com/paquetes/${clienteId}`);
    if (!response.ok) throw new Error("Error al obtener los paquetes.");
    return await response.json();
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    return [];
  }
}

// Actualizar dinámicamente la lista de paquetes
function actualizarPaquetes(paquetes) {
  const packageList = document.getElementById("package-list");

  // Limpiar la lista antes de llenarla
  packageList.innerHTML = "";

  // Mostrar mensaje si no hay paquetes
  if (paquetes.length === 0) {
    packageList.innerHTML = `
      <li class="list-group-item text-center">
        No tienes paquetes comprados.
      </li>
    `;
    return;
  }

  // Crear elementos dinámicamente
  paquetes.forEach((paquete) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";

    // Estado del paquete
    let estadoBadge;
    const fechaExpiracion = paquete.fechaExpiracion
      ? new Date(paquete.fechaExpiracion)
      : null;

    if (paquete.estado === "aprobado") {
      estadoBadge =
        fechaExpiracion && fechaExpiracion < new Date()
          ? `<span class="badge bg-danger">Expiró el ${fechaExpiracion.toLocaleDateString()}</span>`
          : `<span class="badge bg-success">Válido hasta ${
              fechaExpiracion?.toLocaleDateString() || "N/A"
            }</span>`;
    } else if (paquete.estado === "pendiente") {
      estadoBadge = `<span class="badge bg-warning">Pendiente</span>`;
    } else {
      estadoBadge = `<span class="badge bg-secondary">${paquete.estado}</span>`;
    }

    li.innerHTML = `
      <span>${paquete.nombrePaquete}: ${paquete.sesionesRestantes} sesiones</span>
      ${estadoBadge}
    `;
    packageList.appendChild(li);
  });
}

// Inicializar el perfil al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const encabezado = document.querySelector(".encabezado h1");
  if (encabezado) encabezado.textContent = obtenerSaludo();

  obtenerPaquetes().then((paquetes) => actualizarPaquetes(paquetes));

  obtenerProximaClase().then((clase) => {
    const proximaClase = document.getElementById("proximaClase");
    if (!proximaClase) {
      console.error("Elemento con id 'proximaClase' no encontrado en el DOM.");
      return;
    }

    if (clase.length === 0) {
      proximaClase.innerHTML = `
        <li class="list-group-item text-center">No tienes clases reservadas.</li> 
      `;
    } else {
      proximaClase.innerHTML = clase
        .map(
          (c) => `
          <li class="list-group-item">
            <strong>Clase:</strong> ${c.nombreClase}<br>
            <strong>Fecha:</strong> ${c.fecha}<br>
            <strong>Hora:</strong> ${c.hora}
          </li>`
        )
        .join("");
    }
  });
});

async function obtenerProximaClase() {
  const clienteId = sessionStorage.getItem("clienteId");
  if (!clienteId) {
    console.error("No se encontró el ID del cliente en el sessionStorage.");
    return [];
  }

  try {
    const response = await fetch(`https://monetback.com/clientes/nextclass?clienteId=${clienteId}`);
    if (!response.ok) throw new Error("Error al obtener próximas clases.");
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    return [];
  }
}



// cancelar reserva
// https://monetback.com/clientes/cancelar
// DELETE
// body: { "claseId": "int", "clienteId": "int", "fecha": "String" }

//proximo clase 