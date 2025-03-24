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

const form = document.getElementById("dataForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const date = new Date().toISOString();

    const formData = { date, email, name };

    saveDataLocally(formData);

    fireConfetti();
  });

function saveDataLocally(data) {
  let storedData = JSON.parse(localStorage.getItem("formData")) || [];
  storedData.push(data);
  localStorage.setItem("formData", JSON.stringify(storedData));
  console.log("Данные сохранены локально");
  form.reset();
}

const jsConfetti = new JSConfetti();

function fireConfetti() {
  let confettiCount = 200;
  let emojiCount = 20;
  if (window.innerWidth > 768) {
    confettiCount = 500;
    emojiCount = 100;
  }

  jsConfetti.addConfetti({
    confettiColors: new Array(360)
      .fill("")
      .map((c, i) => `hsl(${i}, 100%, 50%)`),
    confettiNumber: confettiCount,
    confettiRadius: 6,
  });

  jsConfetti.addConfetti({
    emojis: ["🦄", "✨", "💫", "🎉", "🎊"],
    emojiSize: 35,
    confettiNumber: emojiCount,
  });
}