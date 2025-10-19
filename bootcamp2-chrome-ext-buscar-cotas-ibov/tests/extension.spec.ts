import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '..', 'dist');

test.describe('Testes da UI do Popup da Extensão', () => {

  test('deve exibir a cotação da PETR4 ao receber dados da API simulada', async ({ page }) => {
    await page.route('https://brapi.dev/api/quote/PETR4**', async (route) => {
      const mockResponse = {
        results: [
          {
            longName: 'Petróleo Brasileiro S.A. - Petrobras',
            logourl: 'https://s3-symbol-logo.tradingview.com/petrobras.svg',
            regularMarketPrice: 38.50,
            fiftyTwoWeekRange: '25.00 - 40.00',
          },
        ],
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    });

    const popupHtmlPath = path.resolve(distPath, 'src', 'popup', 'popup.html');
    await page.goto(`file://${popupHtmlPath}`);

    await page.locator('input#ticker').fill('PETR4');
    await page.locator('button#buscar').click();

    const nomeResultado = page.locator('h2#nome');
    await expect(nomeResultado).toContainText('Petrobras');
    
    const precoResultado = page.locator('span#preco');
    await expect(precoResultado).toContainText('38,5');
  });

  test('build deve gerar os arquivos essenciais na pasta dist', () => {
    expect(fs.existsSync(distPath), 'A pasta "dist" deve existir. Execute "npm run build" primeiro.').toBe(true);
    const manifestPath = path.resolve(distPath, 'manifest.json');
    const popupHtmlPath = path.resolve(distPath, 'src', 'popup', 'popup.html');
    expect(fs.existsSync(manifestPath)).toBe(true);
    expect(fs.existsSync(popupHtmlPath)).toBe(true);
  });
});