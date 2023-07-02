import React from "react";
import { describe } from "@jest/globals";
import { initStubStore, renderWithStubs } from "./helper/utils";
import { Application } from "../../src/client/Application";

describe("Проверка шапки", () => {

    it("в шапке корректно отображается количество не повторяющихся товаров в ней", () => {
        const storeMap = {
            1: {count: 1, name: "123", price: 123},
            2: {count: 2, name: "234", price: 234},
        }
        const store = initStubStore(storeMap);
        const render = renderWithStubs(<Application />, store);

        const link = render.getByText("Cart", {exact: false});

        expect(link.textContent).toEqual(`Cart (${Object.keys(storeMap).length})`);
    });

    it("в шапке корректно отображается количество не повторяющихся товаров в ней при пустой корзине", () => {
        const render = renderWithStubs(<Application />);

        const link = render.getByText("Cart", {exact: false});

        expect(link.textContent).toEqual(`Cart`);
    });
});