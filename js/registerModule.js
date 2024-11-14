function login() {
  localStorage.clear();
  let email = document.getElementById("txtLogEmail").value;
  let password = document.getElementById("txtlogPass").value;

  const data = {
    emailCliente: email,
    passwordCliente: password,
  };
  //   console.log(data);
  fetch("http://localhost:3000/clientes/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      //   console.log(result);
      localStorage.setItem("user", result.nombreCliente);
      console.log(localStorage.getItem("user"));
      window.location.href = "index.html";
    })
    .catch((error) => console.log("error", error));

  // .then((response) => {
  //   console.log("Status Code:", response);
  //   response.json();
  // })
  // .then((result) => {
  //   if (result.status == 200) {
  //     console.log(result);
  //     // localStorage.setItem("user", email);
  //     window.location.href = "index.html";
  //   }
  // })
  // .catch((error) => console.log("error", error));
}
