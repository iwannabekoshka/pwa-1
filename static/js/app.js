if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );

        registration.onupdatefound = () => {
          const newSW = reg.installing;
          newSW.onstatechange = () => {
            if (
              newSW.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              if (confirm("Доступно обновление. Обновить сейчас?")) {
                newSW.postMessage("skipWaiting");
                window.location.reload();
              }
            }
          };
        };
      })
      .catch(function (err) {
        console.log("ServiceWorker registration failed: ", err);
      });
  });
}

const LOCAL_STORAGE_KEY_TRIALS = "trials";
const LOCAL_STORAGE_KEY_CONFERENCE_NAME = "conferenceName";
