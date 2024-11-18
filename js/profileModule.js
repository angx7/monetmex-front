// // Obtener el nombre del usuario almacenado en la sesión y mostrar un saludo personalizado
// function obtenerSaludo() {
//   const nombreUsuario = sessionStorage.getItem("user");
//   const hora = new Date().getHours(); // Obtiene la hora actual del dispositivo
//   let saludo = "";

//   if (hora >= 0 && hora < 6) {
//     saludo = `¡Hola, ${nombreUsuario}! Espero que tengas una noche tranquila.`; // Saludo para la madrugada
//   } else if (hora >= 6 && hora < 12) {
//     saludo = `¡Buenos días, ${nombreUsuario}!`; // Saludo por la mañana
//   } else if (hora >= 12 && hora < 18) {
//     saludo = `¡Buenas tardes, ${nombreUsuario}!`; // Saludo por la tarde
//   } else {
//     saludo = `¡Buenas noches, ${nombreUsuario}!`; // Saludo por la noche
//   }

//   return saludo;
// }

// // Obtener los paquetes que ha comprado el usuario
// async function obtenerPaquetes() {
//   const clienteId = sessionStorage.getItem("clienteId");
//   const response = await fetch(`http://localhost:3000/paquetes/${clienteId}`);
//   const data = await response.json();
//   return data;
// }

// // Ejecuta el código cuando el DOM esté completamente cargado

// document.addEventListener("DOMContentLoaded", function () {
//   const encabezado = document.querySelector(".encabezado h1");
//   if (encabezado) {
//     encabezado.textContent = obtenerSaludo();
//   }
//   obtenerPaquetes().then((data) => {
//     console.log(data);
//   });
// });

// // Obtener los paquetes que ha comprado el usuario
// async function obtenerPaquetes() {
//   const clienteId = sessionStorage.getItem("clienteId");

//   if (!clienteId) {
//     console.error("No se encontró el ID del cliente en el sessionStorage.");
//     return [];
//   }

//   try {
//     const response = await fetch(`http://localhost:3000/paquetes/${clienteId}`);
//     if (!response.ok) {
//       throw new Error("Error al obtener los paquetes.");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error al realizar la solicitud:", error);
//     return [];
//   }
// }

// // Actualizar dinámicamente la lista de paquetes en el DOM
// function actualizarPaquetes(paquetes) {
//   const listaPaquetes = document.querySelector(".card-back .list-group");

//   if (!listaPaquetes) {
//     console.error("No se encontró el contenedor de la lista de paquetes.");
//     return;
//   }

//   // Limpiar la lista antes de llenarla
//   listaPaquetes.innerHTML = "";

//   // Si no hay paquetes, mostrar un mensaje
//   if (paquetes.length === 0) {
//     listaPaquetes.innerHTML = `
//       <li class="list-group-item text-center">
//         No tienes paquetes comprados.
//       </li>
//     `;
//     return;
//   }

//   // Crear dinámicamente los elementos de la lista
//   paquetes.forEach((paquete) => {
//     let estadoBadge;
//     const fechaExpiracion = paquete.fechaExpiracion
//       ? new Date(paquete.fechaExpiracion)
//       : null;

//     if (paquete.estado === "aprobado") {
//       if (fechaExpiracion && fechaExpiracion < new Date()) {
//         // Si la fecha de expiración ya pasó
//         estadoBadge = `<span class="badge badge-danger">Expiró el ${fechaExpiracion.toLocaleDateString()}</span>`;
//       } else {
//         // Si aún es válido
//         estadoBadge = `<span class="badge badge-success">Válido hasta ${
//           fechaExpiracion
//             ? fechaExpiracion.toLocaleDateString()
//             : "Sin fecha de expiración"
//         }</span>`;
//       }
//     } else if (paquete.estado === "pendiente") {
//       // Si está pendiente
//       estadoBadge = `<span class="badge badge-warning">Pendiente</span>`;
//     } else {
//       // Otros estados
//       estadoBadge = `<span class="badge badge-secondary">${paquete.estado}</span>`;
//     }

//     const listItem = document.createElement("li");
//     listItem.className =
//       "list-group-item d-flex justify-content-between align-items-center";
//     listItem.innerHTML = `
//       <span>${paquete.nombrePaquete}: ${paquete.duracionDias} días</span>
//       ${estadoBadge}
//     `;

//     listaPaquetes.appendChild(listItem);
//   });
// }

// // Ejecuta el código cuando el DOM esté completamente cargado
// document.addEventListener("DOMContentLoaded", function () {
//   const encabezado = document.querySelector(".encabezado h1");
//   if (encabezado) {
//     encabezado.textContent = obtenerSaludo();
//   }

//   obtenerPaquetes().then((paquetes) => {
//     actualizarPaquetes(paquetes);
//   });
// });

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
    const response = await fetch(`http://localhost:3000/paquetes/${clienteId}`);
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
});
