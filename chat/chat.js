let apiUrl = "https://mock-api.driven.com.br/api/v6/uol";

function startChat() {
  loadMessages();
  getUsers();

  setInterval(loadMessages, 3000);
  setInterval(userStatus, 5000);
  setInterval(getUsers, 10000);
}

function enterChat() {
  let name = document.querySelector(".input-value");
  let userName = name.value;
  console.log(userName);
  const promise = axios.post(`${apiUrl}/participants`, {
    name: userName,
  });
  promise.then(startChat);
  promise.catch(reloadChat);
}

function userStatus() {
  const promise = axios.post(`${apiUrl}/status`, {
    name: userName,
  });
}
function realoadChat() {
  window.location.reload();
}

function loadMessages() {
  const promise = axios.get(`${apiUrl}/messages`);
  promise.then(generateMessages);
}

function generateMessages(response) {
  const ul = document.querySelector(".messages-container");
  ul.innerHTML = "";
  for (let i = 0; i < response.data.length; i++) {
    if (response.data[i].type === "status") {
      ul.innerHTML += `<li>
      <span class="time">${response.data[i].time}</span>
      <span><strong>${response.data[i].from}</strong></span>
      <span>${response.data[i].text}</span>`;
    }
    if (response.data[i].type === "message") {
        ul.innerHTML += `<li>
        <span class="time">${response.data[i].time}</span>
        <span><strong>${response.data[i].from}</strong></span>
        <span> para </span>
        <span><strong>${response.data[i].to}</strong></span>
        <span>${response.data[i].text}</span>`;
      }
  }
}

function sendMessages() {
  const input = document.querySelector(".text");
  const inputValue = input.value;
  const message = {
    from: userName,
    to: "Todos",
    text: inputValue,
    type: "message",
  };
  inputValue = "";
  const promise = axios.post(`${apiUrl}/messages`, message);
  promise.then();
  promise.catch();
}

function getUsers() {
  const promise = axios.get(`${apiUrl}/participants`);
  promise.then();
}
startChat();
