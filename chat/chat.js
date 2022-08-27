let apiUrl = "https://mock-api.driven.com.br/api/v6/uol";

function enterChat() {
  let name = document.querySelector(".input-value");
  let userName = name.value;
  console.log(userName);

  const promise = axios.post(`${apiUrl}/participants`, {
    name: userName,
  });

  promise.then();
  promise.catch();
}

function userStatus() {
  const promise = axios.post(`${apiUrl}/status`, {
    name: userName,
  });
  promise.then();
  promise.catch();
}

function loadMessages() {
  const promise = axios.get(`${apiUrl}/messages`, {
    from: userName,
    to: "",
    text: "",
    type: "",
    time: "",
  });
  promise.then();
  promise.catch();
}

function sendMessages() {
  const promise = axios.post(`${apiUrl}/messages`, {
    from: userName,
    to: "",
    text: "",
    type: "",
  });
  promise.then();
  promise.catch();
}
