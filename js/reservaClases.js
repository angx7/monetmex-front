// // Variables globales
// let userPackages = {};

// // Función para obtener paquetes de usuario desde la API
// async function fetchUserPackages(userId, category) {
//   try {
//     const searchTerm = category === "Pilates Reformer" ? "Pilates" : category;
//     const response = await fetch(
//       `http://localhost:3000/clases/approved-packages?clienteId=${userId}&searchTerm=${searchTerm}`
//     );
//     const data = await response.json();
//     console.log(`Fetched data for ${category}:`, data); // Log the fetched data
//     userPackages[category] = { packages: data };
//   } catch (error) {
//     console.error("Error fetching user packages:", error);
//   }
// }

// // Función para obtener la disponibilidad de clases desde la API
// async function fetchClassAvailability(day, category) {
//   console.log(`Fetching availability for ${day} and ${category}...`);
//   try {
//     const response = await fetch(
//       `http://localhost:3000/clases/horarios?diaSemana=${day}&disciplina=${category}`
//     );
//     const data = await response.json();
//     console.log(`Availability for ${day} and ${category}:`, data);

//     // Filtrar las clases según la disponibilidad
//     const availableClasses = data.filter((item) => item.lugaresDisponibles > 0);

//     // Preparar un objeto de disponibilidad por horario
//     const availability = {};

//     availableClasses.forEach((item) => {
//       if (!availability[item.Clase]) {
//         availability[item.Clase] = {
//           time: item.horaInicio,
//           slots: item.lugaresDisponibles,
//           discipline: item.disciplina,
//         };
//       }
//     });

//     return availability; // Retornar el objeto con horarios disponibles
//   } catch (error) {
//     console.error("Error fetching class availability:", error);
//   }
// }

// // Función para transformar la hora de formato 24 horas a 12 horas
// function formatTimeTo12Hour(timeString) {
//   const [hour, minute] = timeString.split(":").map(Number);
//   let period = "AM";
//   let formattedHour = hour;

//   if (hour >= 12) {
//     period = "PM";
//     if (hour > 12) formattedHour = hour - 12;
//   } else if (hour === 0) {
//     formattedHour = 12;
//   }

//   return `${formattedHour}:${minute < 10 ? "0" + minute : minute} ${period}`;
// }

// // Función para mostrar los paquetes disponibles para la categoría seleccionada
// function showAvailablePackages(category) {
//   const packageSelect = document.getElementById("packageSelect");
//   packageSelect.innerHTML = ""; // Limpiar opciones previas

//   // Verificar si hay paquetes disponibles para la categoría
//   const packages = userPackages[category]?.packages || [];

//   if (packages.length > 0) {
//     packages.forEach((pkg) => {
//       const option = document.createElement("option");
//       option.value = pkg.paqueteId; // ID del paquete
//       option.textContent = `${pkg.nombrePaquete} - ${pkg.sesionesRestantes} clases restantes`;
//       packageSelect.appendChild(option);
//     });
//   } else {
//     const option = document.createElement("option");
//     option.textContent = "No hay paquetes disponibles";
//     option.disabled = true;
//     packageSelect.appendChild(option);
//   }
// }

// // Actualizar horarios según el día
// document
//   .getElementById("dayOfWeek")
//   .addEventListener("change", async function () {
//     const selectedDay = this.value;
//     const category = document.getElementById("category").value;
//     const searchTerm = category === "Pilates Reformer" ? "Pilates" : category;
//     const scheduleSelect = document.getElementById("schedule");

//     // Limpiar horarios actuales
//     scheduleSelect.innerHTML =
//       '<option value="" disabled selected>Selecciona un horario</option>';

//     // Obtener disponibilidad de clases para el día seleccionado
//     const availability = await fetchClassAvailability(selectedDay, searchTerm);

//     // Mostrar los horarios disponibles en el select
//     if (availability) {
//       Object.values(availability).forEach((classInfo) => {
//         const option = document.createElement("option");
//         const formattedTime = formatTimeTo12Hour(classInfo.time);
//         option.value = classInfo.Clase;
//         option.textContent = `${classInfo.discipline} - ${formattedTime} (Lugares disponibles: ${classInfo.slots})`;
//         scheduleSelect.appendChild(option);
//       });
//     } else {
//       console.log("No hay clases disponibles para el día seleccionado.");
//     }
//   });

// // Abrir el modal de reserva y cargar categoría
// document.querySelectorAll(".reserve-button").forEach((button) => {
//   button.addEventListener("click", function () {
//     const category = this.getAttribute("data-category");
//     document.getElementById("category").value = category;

//     // Reiniciar selects
//     document.getElementById("dayOfWeek").value = "";
//     const scheduleSelect = document.getElementById("schedule");
//     scheduleSelect.innerHTML =
//       '<option value="" disabled selected>Selecciona un horario</option>';

//     // Mostrar alerta si tiene un paquete activo
//     const packageAlert = document.getElementById("packageAlert");
//     const paymentMethod = document.getElementById("paymentMethod");

//     // Verificar paquete disponible
//     if (userPackages[category] && userPackages[category].remainingClasses > 0) {
//       packageAlert.classList.remove("d-none");
//       paymentMethod.disabled = true; // Deshabilitar método de pago
//     } else {
//       packageAlert.classList.add("d-none");
//       paymentMethod.disabled = false; // Habilitar método de pago si no hay paquete
//     }

//     // Mostrar los paquetes disponibles para la categoría
//     showAvailablePackages(category);

//     // Mostrar modal
//     const modal = new bootstrap.Modal(
//       document.getElementById("reservationModal")
//     );
//     modal.show();
//   });
// });

// // Confirmar reserva
// document
//   .getElementById("reservationForm")
//   .addEventListener("submit", function (e) {
//     e.preventDefault();

//     const category = document.getElementById("category").value;
//     const dayOfWeek = document.getElementById("dayOfWeek").value;
//     const schedule = document.getElementById("schedule").value;
//     const paymentMethod = document.getElementById("paymentMethod").value;
//     const packageSelect = document.getElementById("packageSelect");
//     const selectedPackageId = packageSelect.value;

//     if (!dayOfWeek || !schedule) {
//       alert("Por favor selecciona un día de la semana y un horario.");
//       return;
//     }

//     // Verificar disponibilidad y descontar cupo
//     const availability = classAvailability[dayOfWeek];
//     if (availability && availability[schedule] > 0) {
//       availability[schedule]--; // Descontar el cupo

//       // Verificar si el usuario tiene un paquete activo y el paquete seleccionado
//       const selectedPackage = userPackages[category]?.packages.find(
//         (pkg) => pkg.paqueteId == selectedPackageId
//       );

//       if (selectedPackage && selectedPackage.sesionesRestantes > 0) {
//         // Usar una clase del paquete seleccionado
//         selectedPackage.sesionesRestantes--;
//         alert(
//           `Reserva confirmada para ${category} el ${dayOfWeek} a las ${schedule}. Pagado con tu paquete: ${selectedPackage.nombrePaquete}. Clases restantes: ${selectedPackage.sesionesRestantes}`
//         );
//       } else {
//         alert(
//           `Reserva confirmada para ${category} el ${dayOfWeek} a las ${schedule} con método de pago: ${paymentMethod}`
//         );
//       }
//     } else {
//       alert("Lo sentimos, no hay cupos disponibles para este horario.");
//       return;
//     }

//     // Cerrar el modal después de la reserva
//     const modal = bootstrap.Modal.getInstance(
//       document.getElementById("reservationModal")
//     );
//     modal.hide();
//   });

// // Obtener el cliente ID desde el almacenamiento
// const userId = sessionStorage.getItem("clienteId"); // Reemplazar con ID real

// // Consultar los paquetes del usuario para cada categoría
// const categories = ["Pilates Reformer", "Barre", "Yoga"];
// categories.forEach((category) => {
//   fetchUserPackages(userId, category);
// });

// Variables globales
let userPackages = {};

// Función para obtener paquetes de usuario desde la API
async function fetchUserPackages(userId, category) {
  try {
    const searchTerm = category === "Pilates Reformer" ? "Pilates" : category;
    const response = await fetch(
      `http://localhost:3000/clases/approved-packages?clienteId=${userId}&searchTerm=${searchTerm}`
    );
    const data = await response.json();
    console.log(`Fetched data for ${category}:`, data); // Log the fetched data
    userPackages[category] = { packages: data };
  } catch (error) {
    console.error("Error fetching user packages:", error);
  }
}

// Función para obtener la disponibilidad de clases desde la API
async function fetchClassAvailability(day, category) {
  console.log(`Fetching availability for ${day} and ${category}...`);
  try {
    const response = await fetch(
      `http://localhost:3000/clases/horarios?diaSemana=${day}&disciplina=${category}`
    );
    const data = await response.json();
    console.log(`Availability for ${day} and ${category}:`, data);

    // Filtrar las clases según la disponibilidad
    const availableClasses = data.filter((item) => item.lugaresDisponibles > 0);

    // Preparar un objeto de disponibilidad por horario
    const availability = {};

    availableClasses.forEach((item) => {
      if (!availability[item.Clase]) {
        availability[item.Clase] = {
          time: item.horaInicio,
          slots: item.lugaresDisponibles,
          discipline: item.disciplina,
        };
      }
    });

    return availability; // Retornar el objeto con horarios disponibles
  } catch (error) {
    console.error("Error fetching class availability:", error);
  }
}

// Función para transformar la hora de formato 24 horas a 12 horas
function formatTimeTo12Hour(timeString) {
  const [hour, minute] = timeString.split(":").map(Number);
  let period = "AM";
  let formattedHour = hour;

  if (hour >= 12) {
    period = "PM";
    if (hour > 12) formattedHour = hour - 12;
  } else if (hour === 0) {
    formattedHour = 12;
  }

  return `${formattedHour}:${minute < 10 ? "0" + minute : minute} ${period}`;
}

// Función para mostrar los paquetes disponibles para la categoría seleccionada
function showAvailablePackages(category) {
  const packageSelect = document.getElementById("packageSelect");
  packageSelect.innerHTML = ""; // Limpiar opciones previas

  // Verificar si hay paquetes disponibles para la categoría
  const packages = userPackages[category]?.packages || [];

  if (packages.length > 0) {
    packages.forEach((pkg) => {
      const option = document.createElement("option");
      option.value = pkg.paqueteId; // ID del paquete
      option.textContent = `${pkg.nombrePaquete} - ${pkg.sesionesRestantes} clases restantes`;
      packageSelect.appendChild(option);
    });
  } else {
    const option = document.createElement("option");
    option.textContent = "No hay paquetes disponibles";
    option.disabled = true;
    packageSelect.appendChild(option);
  }
}

// Actualizar horarios según el día
document
  .getElementById("dayOfWeek")
  .addEventListener("change", async function () {
    const selectedDay = this.value;
    const category = document.getElementById("category").value;
    const searchTerm = category === "Pilates Reformer" ? "Pilates" : category;
    const scheduleSelect = document.getElementById("schedule");

    // Limpiar horarios actuales
    scheduleSelect.innerHTML =
      '<option value="" disabled selected>Selecciona un horario</option>';

    // Obtener disponibilidad de clases para el día seleccionado
    const availability = await fetchClassAvailability(selectedDay, searchTerm);

    // Mostrar los horarios disponibles en el select
    if (availability) {
      Object.values(availability).forEach((classInfo) => {
        const option = document.createElement("option");
        const formattedTime = formatTimeTo12Hour(classInfo.time);
        option.value = classInfo.Clase;
        option.textContent = `${classInfo.discipline} - ${formattedTime} (Lugares disponibles: ${classInfo.slots})`;
        scheduleSelect.appendChild(option);
      });
    } else {
      console.log("No hay clases disponibles para el día seleccionado.");
    }
  });

// Abrir el modal de reserva y cargar categoría
document.querySelectorAll(".reserve-button").forEach((button) => {
  button.addEventListener("click", function () {
    const category = this.getAttribute("data-category");
    document.getElementById("category").value = category;

    // Reiniciar selects
    document.getElementById("dayOfWeek").value = "";
    const scheduleSelect = document.getElementById("schedule");
    scheduleSelect.innerHTML =
      '<option value="" disabled selected>Selecciona un horario</option>';

    // Mostrar alerta si tiene un paquete activo
    const packageAlert = document.getElementById("packageAlert");
    const paymentMethod = document.getElementById("paymentMethod");

    // Verificar si los paquetes existen y si hay clases restantes
    const packages = userPackages[category]?.packages || [];

    // Asegurarse de que `packages` es un arreglo antes de usar `.some()`
    if (
      Array.isArray(packages) &&
      packages.some((pkg) => pkg.sesionesRestantes > 0)
    ) {
      packageAlert.classList.remove("d-none");
      paymentMethod.disabled = true; // Deshabilitar método de pago
    } else {
      packageAlert.classList.add("d-none");
      paymentMethod.disabled = false; // Habilitar método de pago si no hay paquete
    }

    // Mostrar los paquetes disponibles para la categoría
    showAvailablePackages(category);

    // Mostrar modal
    const modal = new bootstrap.Modal(
      document.getElementById("reservationModal")
    );
    modal.show();
  });
});

// Confirmar reserva
document
  .getElementById("reservationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const category = document.getElementById("category").value;
    const dayOfWeek = document.getElementById("dayOfWeek").value;
    const schedule = document.getElementById("schedule").value;
    const paymentMethod = document.getElementById("paymentMethod").value;
    const packageSelect = document.getElementById("packageSelect");
    const selectedPackageId = packageSelect.value;

    if (!dayOfWeek || !schedule) {
      alert("Por favor selecciona un día de la semana y un horario.");
      return;
    }

    // Verificar disponibilidad y descontar cupo
    const availability = classAvailability[dayOfWeek];
    if (availability && availability[schedule] > 0) {
      availability[schedule]--; // Descontar el cupo

      // Verificar si el usuario tiene un paquete activo y el paquete seleccionado
      const selectedPackage = userPackages[category]?.packages.find(
        (pkg) => pkg.paqueteId == selectedPackageId
      );

      if (selectedPackage && selectedPackage.sesionesRestantes > 0) {
        // Usar una clase del paquete seleccionado
        selectedPackage.sesionesRestantes--;
        alert(
          `Reserva confirmada para ${category} el ${dayOfWeek} a las ${schedule}. Pagado con tu paquete: ${selectedPackage.nombrePaquete}. Clases restantes: ${selectedPackage.sesionesRestantes}`
        );
      } else {
        alert(
          `Reserva confirmada para ${category} el ${dayOfWeek} a las ${schedule} con método de pago: ${paymentMethod}`
        );
      }
    } else {
      alert("Lo sentimos, no hay cupos disponibles para este horario.");
      return;
    }

    // Cerrar el modal después de la reserva
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("reservationModal")
    );
    modal.hide();
  });

// Obtener el cliente ID desde el almacenamiento
const userId = sessionStorage.getItem("clienteId"); // Reemplazar con ID real

// Consultar los paquetes del usuario para cada categoría
const categories = ["Pilates Reformer", "Barre", "Yoga"];
categories.forEach((category) => {
  fetchUserPackages(userId, category);
});