(function () {
  let user;
  const socket = io();
  // form-message
  const formMessage = document.getElementById("form-message");
  // input-message
  const inputMessage = document.getElementById("input-message");
  // log-messages
  const logMessages = document.getElementById("log-messages");

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  formMessage.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = inputMessage.value;
    socket.emit("new-message", { user, message });
    inputMessage.value = "";
    inputMessage.focus();
  });

  function updateLogMessages(messages) {
    messages.map((msg) => {
      const div = document.createElement("div");
      div.classList = "flex h-auto w-[20rem] bg-[#075E54] rounded-full ps-2 mb-2 ms-2";
      const p = document.createElement("p");
      p.innerText = `${msg.user}: ${msg.message}`;
      div.appendChild(p);
      logMessages.appendChild(div);
    });
  }

  socket.on("notification", ({ messages }) => {
    updateLogMessages(messages);
  });

  socket.on("new-message-from-api", (message) => {
    console.log("new-message-from-api ->", message);
  });

  socket.on("new-client", () => {
    Toast.fire({
      title: "Nuevo usuario conectado 🤩",
    });
  });

  Swal.fire({
    title: "Ingresa con tu email por favor 👮",
    input: "email",
    inputLabel: "Ingresa tu email",
    allowOutsideClick: false,
    inputValidator: (value) => {
      if (!value) {
        return "Necesitamos que ingreses un email para continuar!";
      }
    },
  }).then((result) => {
    user = result.value.trim();
    console.log(`Hola ${user}, bienvenido 🖐️`);
  });
})();
