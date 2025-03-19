if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      })
      .catch(function (err) {
        console.log("ServiceWorker registration failed: ", err);
      });
  });
}

const ENDPOINT = "https://pwa-1-server.onrender.com/trials/";

const form = document.getElementById("dataForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const date = new Date().toISOString();

    const formData = { date, email, name };

    if (navigator.onLine) {
      sendDataToServer(formData);
    } else {
      saveDataLocally(formData);
    }
  });

function sendDataToServer(data) {
  fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Данные успешно отправлены на сервер");
        form.reset();
      } else {
        console.error("Ошибка при отправке данных на сервер");
      }
    })
    .catch((error) => {
      console.error("Ошибка:", error);
      saveDataLocally(data); // Если отправка не удалась, сохраняем локально
    });
}

function saveDataLocally(data) {
  let storedData = JSON.parse(localStorage.getItem("formData")) || [];
  storedData.push(data);
  localStorage.setItem("formData", JSON.stringify(storedData));
  console.log("Данные сохранены локально");
  form.reset();
}

// Проверка соединения и отправка данных, если оно восстановлено
setInterval(() => {
  if (navigator.onLine) {
    let storedData = JSON.parse(localStorage.getItem("formData")) || [];
    if (storedData.length > 0) {
      storedData.forEach((data) => {
        sendDataToServer(data);
      });
      localStorage.removeItem("formData");
    }
  }
}, 5000);
