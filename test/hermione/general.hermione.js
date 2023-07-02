//npm run test:unit


const {getUrlWithBug} = require("./helper/utils");

describe('Общие требования:', async function() {
	it('прогревочный тест', async function({ browser }) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(getUrlWithBug('http://localhost:3000/hw/store/'), {timeout: 8000});

    });

    it('вёрстка должна адаптироваться под ширину экрана', async function({ browser }) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(getUrlWithBug('http://localhost:3000/hw/store/'));
        
        // Установка ширины экрана
        await page.setViewport({ width: 1200, height: 500 });
        await browser.assertView('desktop', '.navbar'); // нет смысла проверять остальную страницу, если навбар адаптировался к ширине
        
        await page.setViewport({ width: 800, height: 500 });
        await browser.assertView('tablet', '.navbar');
        
        await page.setViewport({ width: 400, height: 500 });
        await browser.assertView('mobile', '.navbar');
    });

    it('в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(getUrlWithBug('http://localhost:3000/hw/store/'));
        await page.waitForSelector(".navbar", { timeout: 5000});
        await browser.assertView('navbar', '.navbar');

        const headerLinks = await page.evaluate(() => {
            const header = document.querySelector('.navbar');
            const links = header.querySelectorAll('a');
            const hrefs = Array.from(links).map(link => link.getAttribute('href'));
            return hrefs;
        });

        console.log(`Найденные ссылки: ${headerLinks}`);
        expect(headerLinks).toContain('/hw/store/cart'); // ссылка на корзину
        expect(headerLinks).toContain('/hw/store/catalog'); // ссылки на остальные страницы магазина
        expect(headerLinks).toContain('/hw/store/delivery');
        expect(headerLinks).toContain('/hw/store/contacts');
    });

    it('название магазина в шапке должно быть ссылкой на главную страницу', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(getUrlWithBug('http://localhost:3000/hw/store/'));
        await page.waitForSelector(".navbar", { timeout: 5000});
        const navbarBrandTitle = await page.evaluate(() => {
            const navbarBrand = document.querySelector('.navbar-brand');
            return navbarBrand.getAttribute('href');
        });

        console.log(`Ссылка на главную страницу: ${navbarBrandTitle}`);
        expect(navbarBrandTitle).toEqual('/hw/store/'); 
    });

    it('на ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(getUrlWithBug('http://localhost:3000/hw/store/'));
        await page.setViewport({ width: 575, height: 500 });
        const isMenuHidden = await page.evaluate(async () => {
            const navbarButton = document.querySelector('.navbar-toggler');
            return !!navbarButton;
        });
        await browser.assertView('navbar with toggler', '.navbar');
        expect(isMenuHidden).toBeTruthy();
    });

    it('при выборе элемента из меню "гамбургера", меню должно закрываться', async function({ browser }) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(getUrlWithBug('http://localhost:3000/hw/store/'));
        await page.setViewport({ width: 575, height: 500 });
        await page.click('.navbar-toggler');
        await page.click('.nav-link');
        await page.waitForTimeout(500);
        const isMenuHidden = await page.evaluate(() => {
            const menu = document.querySelector('.Application-Menu');
            return menu.classList.contains('collapse');
        });

        expect(isMenuHidden).toBeTruthy();
    });

    
});
