const localTrialsElem = document.querySelector("#trials-local");
const clearLocalDataBtn = document.querySelector("#clear-local-data");
const saveExcelBtn = document.querySelector("#save-to-excel");
const conferenceInput = document.querySelector("#conference-name");
const countElem = document.querySelector("#rows-count");

renderTrials();

function renderTrials() {
  localTrialsElem.innerHTML = "";
  const tbody = document.createElement("tbody");
  localTrialsElem.appendChild(tbody);

  const thRow = document.createElement("tr");
  tbody.appendChild(thRow);

  const localData =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TRIALS)) || [];
  const headers = Object.keys(localData[0]).sort();
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;

    thRow.appendChild(th);
  });

  countElem.textContent = localData.length;

  localData.forEach((item) => {
    const tr = document.createElement("tr");
    tbody.appendChild(tr);

    headers.forEach((header) => {
      const td = document.createElement("td");
      const value = item[header];

      if (header === "date") {
        const event = new Date(value);
        td.textContent = event.toLocaleDateString("ru-RU", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        });
      } else {
        td.textContent = value;
      }

      tr.appendChild(td);
    });
  });
}

saveExcelBtn.addEventListener("click", async function () {
  const currentDate = (new Date().toLocaleDateString()).replace(/\//gm, "_");
  const defaultFileName = `trials_${conferenceInput.value}_${currentDate}`;
  const fileName = prompt("Введите имя файла", defaultFileName) || defaultFileName;

  // Получаем данные из localStorage
  let trials = localStorage.getItem(LOCAL_STORAGE_KEY_TRIALS);

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

  // Генерация XML для Excel
  const xmlHeader = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Data">
    <Table>`;

  // Определяем заголовки (ключи объектов)
  const headers = Object.keys(trials[0]);

  // Создаем строку заголовков
  let xmlContent = `<Row>`;
  headers.forEach((header) => {
    xmlContent += `<Cell><Data ss:Type="String">${header}</Data></Cell>`;
  });
  xmlContent += `<Cell><Data ss:Type="String">humanDate</Data></Cell>`;
  xmlContent += `</Row>`;

  // Добавляем данные в таблицу
  trials.forEach((row) => {
    xmlContent += `<Row>`;
    headers.forEach((field) => {
      let cellValue = row[field] ? row[field] : "";
      xmlContent += `<Cell><Data ss:Type="String">${cellValue}</Data></Cell>`;
    });
    const date = new Date(row.date);
    const humanDate = date.toLocaleDateString("ru-RU", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    xmlContent += `<Cell><Data ss:Type="String">${humanDate}</Data></Cell>`;
    xmlContent += `</Row>`;
  });

  // Закрываем XML
  const xmlFooter = `</Table>
  </Worksheet>
</Workbook>`;

  // Собираем полный XML-файл
  const excelContent = xmlHeader + xmlContent + xmlFooter;

  // Создаём Blob для скачивания
  const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.xls`; // Используем .xls (будет открываться в Excel)

  // Для iOS добавляем ссылку в DOM перед кликом
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

clearLocalDataBtn.addEventListener("click", (e) => {
  const answer = confirm(
    "Вы точно хотите очистить данные приложения? Если они ранее не сохранены в Excel, то будут утеряны НАВСЕГДА."
  );

  if (!answer) {
    return;
  }

  localStorage.removeItem(LOCAL_STORAGE_KEY_TRIALS);
  renderTrials();
});

conferenceInput.value =
  localStorage.getItem(LOCAL_STORAGE_KEY_CONFERENCE_NAME) || "";
conferenceInput.addEventListener("input", (e) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_CONFERENCE_NAME, e.target.value);
});
