const socket = io("http://localhost:8000");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
};

const userName = prompt("Please enter your name to join chat room!");
socket.emit("new-user-joined", userName);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});

socket.on("New user joined", (userName) => {
  append(`${userName} joined the chat`, "left");
});

socket.on("receive", (data) => {
  append(`${data.name}: ${data.message} `, "left");
});

socket.on("left", (name) => {
  append(`${name} left the chat room `, "left");
});
