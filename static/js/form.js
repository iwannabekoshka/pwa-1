const form = document.getElementById("dataForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const date = new Date().toISOString();
    const conferenceName = localStorage.getItem(LOCAL_STORAGE_KEY_CONFERENCE_NAME, "");

    const formData = { date, email, name, conferenceName };

    saveDataLocally(formData);

    fireConfetti();
  });

function saveDataLocally(data) {
  let storedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TRIALS)) || [];
  storedData.push(data);
  localStorage.setItem(LOCAL_STORAGE_KEY_TRIALS, JSON.stringify(storedData));
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

const trialsLink = document.querySelector("#link-trials");
trialsLink.addEventListener("click", e => {
  e.preventDefault();

  const answer = prompt("Введите пароль");

  if (answer === "123") {
    window.location.href = "/trials.html";
  } else {
    alert("Кажется, вам сюда нельзя. Если всё же можно, то запросите пароль у Веб-отдела :)");
  }
})