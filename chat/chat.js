let apiUrl = "https://mock-api.driven.com.br/api/v6/uol";
let receptor = "Todos";
let messageType = "message";
let userName;
let userLastName;
let lastTime;

function startChat() {
  loadMessages();
  getUsers();
  setInterval(loadMessages, 3000);
  setInterval(userStatus, 5000);
  setInterval(getUsers, 10000);

  document.addEventListener("keyup", sendMessageWithEnter);
}

function sendMessageWithEnter(event) {
  if (event.key === "Enter") {
    sendMessages();
  }
}

function enterRoom() {
  userName = prompt("Qual o seu nome?");
  const promise = axios.post(`${apiUrl}/participants`, {
    name: userName,
  });
  promise.then(startChat);
  promise.catch(nameAlredyUsed);
}
function nameAlredyUsed() {
  userName = prompt("Este nome já está em uso. Por favor, digite outro nome!");
  const promise = axios.post(`${apiUrl}/participants`, {
    name: userName,
  });
  promise.then(startChat);
  promise.catch(nameAlredyUsed);
}

/* function enterChat() {
  let name = document.querySelector(".input-value");
  let userName = name.value;
  const promise = axios.post(`${apiUrl}/participants`, {
    name: userName,
  });
  promise.then(startChat);
  promise.catch(reloadChat);
}
 */
function userStatus() {
  axios.post(`${apiUrl}/status`, {
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
      <span> ${response.data[i].text} </span>
      </li>`;
    }
    if (response.data[i].type === "message") {
      ul.innerHTML += `<li class="message">
        <span class="time">(${response.data[i].time}) </span>
        <span><strong> ${response.data[i].from} </strong></span>
        <span> para </span>
        <span class="to"><strong>${response.data[i].to}:</strong></span>
        <span class="text-message"> ${response.data[i].text} </span>
        </li>`;
    }
    if (
      response.data[i].type === "privateMessage" &&
      (response.data[i].to === userName || response.data[i].from === userName)
    ) {
      ul.innerHTML += `<li class="private">
        <span class="time">(${response.data[i].time}) </span>
        <span><strong> ${response.data[i].from} </strong></span>
        <span> reservadamente para </span>
        <span><strong> ${response.data[i].to} </strong></span>
        <span> ${response.data[i].text} </span>
        </li>`;
    }

    const lastMessage = response.data[response.data.length - 1].time;
    scrollChat(lastMessage);
  }

  function scrollChat(lastMessage) {
    lastMessage = document.querySelector(".messages-container li:last-child");
    if (lastMessage !== lastTime) {
      lastMessage.scrollIntoView();
      lastTime = lastMessage;
    }
  }
}

function sendMessages() {
  const input = document.querySelector(".text");
  const inputValue = input.value;
  const message = {
    from: userName,
    to: receptor,
    text: inputValue,
    type: messageType,
  };
  input.value = "";
  const promise = axios.post(`${apiUrl}/messages`, message);
  promise.then(loadMessages);
  promise.catch(reloadChat);
}

function generateUser(response) {
  let listOfUsers = document.querySelector(".target");
  let classOfUsers = "";
  if (receptor === "Todos") {
    classOfUsers = "selected";
  }
  listOfUsers.innerHTML = `<li class="target-public ${classOfUsers} onclick="targetMessage(this)" data-identifier="participant">
  <ion-icon name="people"></ion-icon><span class="name">Todos</span>
  </li>`;

  for (let i = 0; i < response.data.length; i++) {
    if (receptor === response.data[i].name) {
      classOfUsers = "selected";
    } else {
      classOfUsers = "";
    }
    listOfUsers.innerHTML += `<li class="target-public ${classOfUsers} onclick="targetMessage(this)" data-identifier="participant">
    <ion-icon name="person-circle"></ion-icon>
    <span class="name">${response.data[i].name}</span>
  </li>`;
  }
}

function targetMessage(element) {
  receptor = element.querySelector(".name").innerHTML;
  const message = document.querySelector(".sending");
  if (messageType === "message") {
    message.innerHTML = `Enviando para ${receptor}`;
  } else {
    message.innerHTML = `Enviando para ${receptor} (reservadamente)`;
  }
  getUsers();
}

function getUsers() {
  const promise = axios.get(`${apiUrl}/participants`);
  promise.then(generateUser);
}

function chooseVisibility(element, type) {
  document
    .querySelector(".visibilities .selected")
    .classList.remove("selected");
  element.classList.add("selected");
  messageType = type;
}

function openMenu() {
  const menu = document.querySelector(".menu");
  const background = document.querySelector(".background-menu");
  menu.classList.toggle("hidden");
  background.classList.toggle("background-hidden");
}

enterRoom();
