const localList = document.querySelector("#trials-local");

let localData = JSON.parse(localStorage.getItem("formData")) || [];
localData.forEach((item) => {
  const listItem = document.createElement("li");
  listItem.textContent = `${item.date} ${item.email} ${item.name}`;

  localList.appendChild(listItem);
});

document
  .getElementById("saveToExcel")
  .addEventListener("click", async function () {
    // Получаем данные из localStorage
    let trials = localStorage.getItem("formData");

    if (!trials) {
      alert("Нет данных для сохранения!");
      return;
    }

    try {
      trials = JSON.parse(trials);
    } catch (e) {
      alert("Ошибка при чтении данных!");
      return;
    }

    if (!Array.isArray(trials) || trials.length === 0) {
      alert("Данные в некорректном формате!");
      return;
    }

    // Преобразуем данные в CSV
    let csvContent = "data:text/csv;charset=utf-8,";

    // Добавляем заголовки (если есть)
    const headers = Object.keys(trials[0]);
    csvContent += headers.join(",") + "\n";

    // Добавляем строки с данными
    trials.forEach((row) => {
      csvContent +=
        headers.map((field) => JSON.stringify(row[field] || "")).join(",") +
        "\n";
    });

    // Создаём ссылку для скачивания
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "trials.csv");

    // Для iOS нужно добавить ссылку в DOM перед кликом
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
