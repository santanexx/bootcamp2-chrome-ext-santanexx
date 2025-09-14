chrome.runtime.onInstalled.addListener(() => {
  console.log("Time Tracker instalado.");

  // Verifica se já existe um tempo salvo, se não, inicializa com 0
  chrome.storage.local.get(["totalSeconds"], (result) => {
    if (result.totalSeconds === undefined) {
      chrome.storage.local.set({ totalSeconds: 0 });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "START_SESSION") {
    const startTime = Date.now();
    chrome.storage.local.set({ sessionActive: true, sessionStart: startTime }, () => {
      chrome.alarms.create("time-tracker-tick", { periodInMinutes: 1 });
      console.log("Sessão iniciada em:", new Date(startTime).toISOString());
      sendResponse({ ok: true, startedAt: startTime });
    });

    
  } else if (message.type === "STOP_SESSION") {
    chrome.storage.local.get(["sessionActive", "sessionStart", "totalSeconds"], (result) => {
      if (!result.sessionActive) {
        sendResponse({ ok: false, error: "Sessão não está ativa" });
        return;
      }
      
      const endTime = Date.now();
      const elapsedSeconds = Math.floor((endTime - result.sessionStart) / 1000);
      const newTotal = result.totalSeconds + elapsedSeconds;

      chrome.storage.local.set({ sessionActive: false, sessionStart: null, totalSeconds: newTotal }, () => {
        chrome.alarms.clear("time-tracker-tick");
        console.log(`Sessão parada. Total: ${newTotal}s`);
        sendResponse({ ok: true, totalSeconds: newTotal });
      });
    });
  } else if (message.type === "GET_STATUS") {
    chrome.storage.local.get(["sessionActive", "sessionStart", "totalSeconds"], (result) => {
      let currentTotal = result.totalSeconds || 0;
      if (result.sessionActive && result.sessionStart) {
        const elapsed = Math.floor((Date.now() - result.sessionStart) / 1000);
        currentTotal += elapsed;
      }
      sendResponse({
        ok: true,
        sessionActive: result.sessionActive || false,
        sessionStart: result.sessionStart || null,
        totalSeconds: currentTotal
      });
    });

  } else if (message.type === "RESET_TOTAL") {
    // Simplesmente zera o total de ssegundos
    chrome.storage.local.set({ totalSeconds: 0 }, () => {
      sendResponse({ ok: true, totalSeconds: 0 });
    });
  }
  return true;
});


chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "time-tracker-tick") {
    chrome.storage.local.get(["sessionStart", "totalSeconds"], (result) => {
      const now = Date.now();
      const elapsedSinceStart = Math.floor((now - result.sessionStart) / 1000);
      const newTotal = result.totalSeconds + elapsedSinceStart;
      chrome.storage.local.set({ totalSeconds: newTotal, sessionStart: now });
      console.log(`Alarme disparado: tempo acumulado atualizado para ${newTotal}s`);
    });
  }
});