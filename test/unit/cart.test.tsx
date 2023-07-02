import React from 'react';
import {describe} from '@jest/globals';
import {initStubStore, renderWithStubs} from './helper/utils';
import {CartState} from '../../src/common/types';
import {Cart} from '../../src/client/pages/Cart';
import {checkoutComplete} from '../../src/client/store';
// @ts-ignore
import events from '@testing-library/user-event';
import {ExampleApi} from "../../src/client/api";

describe("Проверка корзины", () => {

    it("если корзина не пустая, корректно отображаются элементы", () => {
        const products: CartState = {
            1: {count: 1, name: "item 1", price: 123},
            2: {count: 2, name: "item 2", price: 234},
            3: {count: 3, name: "item 3", price: 345},
            4: {count: 4, name: "item 4", price: 456},
        };
        const store = initStubStore(products);
        const render = renderWithStubs(<Cart/>, store);

        for (let i = 1; i <= Object.keys(products).length; i++) {
            let element = render.getByTestId(i);
            expect(Number(element.querySelector(".Cart-Index").textContent)).toBe(i);
            expect(element.querySelector(".Cart-Name").textContent).toBe(products[i].name);
            expect(element.querySelector(".Cart-Price").textContent).toBe(`$${products[i].price}`);
            expect(Number(element.querySelector(".Cart-Count").textContent)).toBe(products[i].count);
            expect(element.querySelector(".Cart-Total").textContent).toBe(`$${products[i].count * products[i].price}`);
        }
    });

    it("корректно отображается общая сумма заказа", async () => {
        const products: CartState = {
            1: {count: 1, name: "item 1", price: 123},
            2: {count: 2, name: "item 2", price: 234},
            3: {count: 3, name: "item 3", price: 345},
            4: {count: 4, name: "item 4", price: 456},
        };
        const store = initStubStore(products);
        const render = renderWithStubs(<Cart/>, store);

        let sum = 0;
        for (let i = 1; i <= Object.keys(products).length; i++) {
            let element = render.getByTestId(i);
            sum += Number(element.querySelector(".Cart-Total").textContent.replace("$", ""));
        }

        expect(
            Number(render.getByRole("table").querySelector(".Cart-OrderPrice").textContent.replace("$", ""))
        ).toBe(sum)
    });

    it("если нажать на кнопку с товарами в корзине, вызывается чекаут", async () => {
        const user = events.setup();
        const stubApi = new ExampleApi("/");
        const mockCheckout = jest.fn((): any => []);
        stubApi.checkout = mockCheckout;
        const store = initStubStore(
            {
                1: {count: 1, name: "item 1", price: 123},
                2: {count: 2, name: "item 2", price: 234},
                3: {count: 3, name: "item 3", price: 345},
                4: {count: 4, name: "item 4", price: 456},
            },
            stubApi
        );
        const render = renderWithStubs(<Cart />, store);

        await user.type(render.getByLabelText("Name"), "Name");
        await user.type(render.getByLabelText("Phone"), "43523989834");
        await user.type(render.getByLabelText("Address"), "Moscow");
        await user.click(render.getByText("Checkout"));

        expect(mockCheckout).toBeCalled();
    });

    it("после нажатия кнопки заказать с товарами в корзине, корзина очистится", async () => {
        const user = events.setup();
        const store = initStubStore({
            1: {count: 1, name: "123", price: 123},
        });
        const render = renderWithStubs(<Cart/>, store);

        const button = render.getByText("Checkout");

        await user.click(button);

        expect(store.getState().cart).toMatchObject({});
    });

    it("после нажатия кнопки очистки корзины, корзина очистится", async () => {
        const user = events.setup();
        const store = initStubStore({
            1: {count: 1, name: "123", price: 123},
        });
        const render = renderWithStubs(<Cart/>, store);

        const button = render.getByText("Clear shopping cart");

        await user.click(button);

        expect(store.getState().cart).toMatchObject({});
    });

    it("после очиститки корзины, появляется соответствующее сообщение", async () => {
        const user = events.setup();
        const store = initStubStore({
            1: {count: 1, name: "123", price: 123},
            2: {count: 2, name: "234", price: 234},
        });
        const render = renderWithStubs(<Cart/>, store);

        const button = render.getByText("Clear shopping cart");

        await user.click(button);
        const message = render.queryByText("Cart is empty.", {exact: false});

        expect(message).toBeTruthy();
    });

    it("валидно отображается номер заказа", () => {
        const orderId = 12;
        const stubStore = initStubStore();
        stubStore.dispatch(checkoutComplete(orderId));

        const render = renderWithStubs(<Cart/>, stubStore);
        const message = render.queryByText("completed", {exact: false});

        expect(message.textContent).toEqual(
            `Order #${orderId} has been successfully completed.`
        );
    });

    it("должна отображаться ссылка на каталог товаров, если корзина пустая", () => {
        const render = renderWithStubs(<Cart/>);

        const link = render.getByRole("link").getAttribute("href");

        expect(link).toBe("/catalog");
    });
});