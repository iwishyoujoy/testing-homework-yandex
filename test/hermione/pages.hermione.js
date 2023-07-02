describe('Проверка существования страниц', () => {
    it('главная страница отвечает 200', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto('http://localhost:3000/hw/store/');
        const response = await page.evaluate(async () => {
            const res = await fetch('/hw/store/');
            return res.status;
        });
        expect(response).toBe(200);
    });
  
    it('страница каталога отвечает 200', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto('http://localhost:3000/hw/store/catalog');
        const response = await page.evaluate(async () => {
            const res = await fetch('/hw/store/catalog');
            return res.status;
        });
        expect(response).toBe(200);
    });
  
    it('страница условий доставки отвечает 200', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto('http://localhost:3000/hw/store/delivery');
        const response = await page.evaluate(async () => {
            const res = await fetch('/hw/store/delivery');
            return res.status;
        });
        expect(response).toBe(200);
    });
  
    it('страница контактов отвечает 200', async ({ browser }) => {
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
    it('верстка страницы товара не меняется', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto('http://localhost:3000/hw/store/catalog/1?bug_id=9');
        await page.waitForSelector(".Product", { timeout: 5000});
        await browser.assertView('product details', '.Product', { ignoreElements: [
            '.ProductDetails-Name',
            '.ProductDetails-Description',
            '.ProductDetails-Price',
            '.ProductDetails-Color',
            '.ProductDetails-Material'
        ] });
    });
})

describe('Корзина: ', () => {
    it('при вводе корректных данных итоговая плашка отображается корректно', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto('http://localhost:3000/hw/store/catalog/0', { timeout: 5000 });

        document.querySelector('.ProductDetails-AddToCart').click(); // добавляем элемент в корзину
        await page.goto('http://localhost:3000/hw/store/cart');
        
        document.querySelector('.Form-Field_type_name').focus(); // вводим корректные данные
        await page.keyboard.type('Darya');
        
        await page.keyboard.press('Tab');
        await page.keyboard.type('88005553535');

        await page.keyboard.press('Tab');
        await page.keyboard.type('hello');

        document.querySelector('.Form-Submit').click(); // отправляем форму

        await browser.assertView('final card of order', '.Cart', { ignoreElements: [ // проверяем правильность плашки
            '.Cart-Number',
        ] });

    });
})