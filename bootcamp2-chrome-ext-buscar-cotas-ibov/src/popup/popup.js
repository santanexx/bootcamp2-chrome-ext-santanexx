// Stateless popup: só busca quando o usuário clicar.
// Nota: token BRAPI embutido (substitua se desejar)
const BRAPI_TOKEN = "iZedUXQS99BeuxuSAL7rRi";

const buscarBtn = document.getElementById("buscar");
const tickerInput = document.getElementById("ticker");
const resultadoEl = document.getElementById("resultado");
const mensagemEl = document.getElementById("mensagem");

buscarBtn.addEventListener("click", async () => {
  const ticker = (tickerInput.value || "").trim().toUpperCase();
  mensagemEl.textContent = "";
  resultadoEl.classList.add("hidden");

  if (!ticker) {
    mensagemEl.textContent = "Digite uma sigla (ex: PETR4)";
    return;
  }

  try {
    mensagemEl.textContent = "Buscando...";
    const url = `https://brapi.dev/api/quote/${encodeURIComponent(ticker)}?token=${BRAPI_TOKEN}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error("Resposta de rede não OK");

    const data = await r.json();
    if (!data.results || data.results.length === 0) {
      throw new Error("Cota não encontrada");
    }

    const c = data.results[0];
    // Populate
    const logoEl = document.getElementById("logo");
    const nomeEl = document.getElementById("nome");
    const precoEl = document.getElementById("preco");
    const faixaEl = document.getElementById("faixa");

    logoEl.src = c.logourl || "";
    logoEl.alt = c.longName || ticker;
    nomeEl.textContent = c.longName || ticker;
    precoEl.textContent = (c.regularMarketPrice !== undefined && c.regularMarketPrice !== null)
      ? Number(c.regularMarketPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : "N/D";
    faixaEl.textContent = c.fiftyTwoWeekRange || "N/D";

    resultadoEl.classList.remove("hidden");
    mensagemEl.textContent = "";
  } catch (err) {
    console.error(err);
    mensagemEl.textContent = "Erro ao buscar cotação. Tente novamente.";
  }
});
