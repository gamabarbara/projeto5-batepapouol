let apiUrl = "https://mock-api.driven.com.br/api/v6/uol";
let userName;
let userLastName;
let receptor = "Todos";
let messageType = "message";

function startChat() {
  loadMessages();

  setInterval(loadMessages, 3000);
  setInterval(userStatus, 5000);
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
function reloadChat() {
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
      ul.innerHTML += `<li class="in-out-room">
      <span class="time">(${response.data[i].time})</span>
      <span><strong> ${response.data[i].from} </strong></span>
      <span> ${response.data[i].text} </span>`;
    }
    if (response.data[i].type === "message") {
      ul.innerHTML += `<li class="message">
        <span class="time">(${response.data[i].time}) </span>
        <span><strong> ${response.data[i].from} </strong></span>
        <span> para </span>
        <span class="target"><strong>${response.data[i].to}:</strong></span>
        <span class="text-message"> ${response.data[i].text} </span>`;
    }
    if (response.data[i].type === "private") {
      ul.innerHTML += `<li class="private">
        <span class="time">(${response.data[i].time}) </span>
        <span><strong> ${response.data[i].from} </strong></span>
        <span> para </span>
        <span><strong> ${response.data[i].to} </strong></span>
        <span> ${response.data[i].text} </span>`;
    }
  }
}

function sendMessages() {
  const input = document.querySelector(".text");
  let inputValue = input.value;
  console.log(inputValue);
  const message = {
    from: userName,
    to: receptor,
    text: inputValue,
    type: messageType,
  };
  inputValue = "";
  const promise = axios.post(`${apiUrl}/messages`, message);
  promise.then(loadMessages);
  promise.catch(reloadChat);
}

startChat();
