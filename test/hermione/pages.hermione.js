describe('Проверка существования страниц', () => {
    it('главная страница', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto('http://localhost:3000/hw/store/');
        const response = await page.evaluate(async () => {
            const res = await fetch('/hw/store/');
            return res.status;
        });
        expect(response).toBe(200);
    });
  
    it('страница каталога', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto('http://localhost:3000/hw/store/catalog');
        const response = await page.evaluate(async () => {
            const res = await fetch('/hw/store/catalog');
            return res.status;
        });
        expect(response).toBe(200);
    });
  
    it('страница условий доставки', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto('http://localhost:3000/hw/store/delivery');
        const response = await page.evaluate(async () => {
            const res = await fetch('/hw/store/delivery');
            return res.status;
        });
        expect(response).toBe(200);
    });
  
    it('страница контактов', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto('http://localhost:3000/hw/store/contacts');
        const response = await page.evaluate(async () => {
            const res = await fetch('/hw/store/contacts');
            return res.status;
        });
        expect(response).toBe(200);
    });
  });

describe('Каталог:', () => {
    
})