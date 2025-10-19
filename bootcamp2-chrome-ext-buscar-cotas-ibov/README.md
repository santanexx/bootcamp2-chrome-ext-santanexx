# Buscar cotas IBOV

Extensão Chrome (Manifest V3) que busca **nome**, **logo** e **preço atual** de uma cota (ex: PETR4) via **Brapi API**. Projeto desenvolvido para o Bootcamp II — Entrega Inicial + Intermediária (containerização + E2E + CI).

---

## 🚀 Funcionalidade principal

- Stateless: não salva estado nem usa `chrome.storage`.
- Ao abrir o popup o usuário informa a sigla (ex: `PETR4`) e clica em **Buscar**.
- A extensão faz **fetch** à BRAPI e exibe:
  - Logo (imagem)
  - Nome completo
  - Preço atual (formatação pt-BR)
  - Variação 52 semanas

---

## 🧭 Como rodar localmente

1. Clone o repositório:
```bash
git clone https://github.com/santanexx/bootcamp2-chrome-ext-santanexx.git
cd bootcamp2-chrome-ext-santanexx
