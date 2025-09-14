const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const timeDisplay = document.getElementById("timeDisplay");
const sessionInfo = document.getElementById("sessionInfo");

/**
 * @param {number} 
 * @returns {string} 
 */

function secondsToHMS(sec) {
  const h = Math.floor(sec / 3600).toString().padStart(2, "0");
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}


function updateUI() {
  chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
    // Este código só roda quando o background script responder.
    if (chrome.runtime.lastError) {
      sessionInfo.textContent = "Erro: " + chrome.runtime.lastError.message;
      return;
    }
    
    if (response && response.ok) {
      timeDisplay.textContent = secondsToHMS(response.totalSeconds);
      
      // Atualiza a informação da sessão (ativa ou inativa).
      if (response.sessionActive) {
        const startTime = new Date(response.sessionStart).toLocaleTimeString();
        sessionInfo.textContent = `Sessao ativa desde ${startTime}`;
      } else {
        sessionInfo.textContent = "Sessao inativa";
      }
    } else {
      sessionInfo.textContent = "Não foi possível obter o status.";
    }
  });
}


startBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "START_SESSION" });
});

stopBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "STOP_SESSION" });
});

resetBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "RESET_TOTAL" });
});



setInterval(updateUI, 1000);

document.addEventListener("DOMContentLoaded", updateUI);