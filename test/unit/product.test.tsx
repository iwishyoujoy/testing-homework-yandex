import React from "react";
import { describe } from "@jest/globals";
import {
    initStubStore,
    renderWithStubs,
} from "./helper/utils";
import { ProductDetails } from "../../src/client/components/ProductDetails";
import events from "@testing-library/user-event";
import { CartState, Product } from "../../src/common/types";

describe("Проверка ProductDetails", () => {
    it("корректно отображаются материал, цена, цвет, имя, описание", () => {
        const product: Product = {
            id: 123,
            name: "name",
            price: 12345,
            description: "description",
            color: "blue",
            material: "material",
        };

        const render = renderWithStubs(<ProductDetails product={product} />)

        expect(render.queryByText(product.color)).toBeTruthy();
        expect(render.queryByText(product.name)).toBeTruthy();
        expect(render.queryByText(`$${product.price}`)).toBeTruthy();
        expect( render.queryByText(product.description)).toBeTruthy();
        expect(render.queryByText(product.material)).toBeTruthy();
    });

    it("при нажатии на кнопку добавления, товар добавиться в корзину", async () => {
        const user = events.setup();
        const product: Product = {
            id: 123,
            name: "name",
            price: 12345,
            description: "description",
            color: "blue",
            material: "material",
        };
        const storeMap = {
            1: { count: 999, name: "name", price: 1123 },
        };
        const store = initStubStore(storeMap);
        const render = renderWithStubs(<ProductDetails product={product} />, store);

        const button = render.getByText("Add to Cart");
        await user.click(button);

        let validStoreMap = {}
        Object.assign(validStoreMap, storeMap, {123: { count: 1, name: product.name, price: product.price }})

        expect(store.getState().cart).toEqual(
            validStoreMap as CartState);
    });

    it("если товар уже естьв  корзине, то при повторном добавлении изменится его счетчик", async () => {
        const user = events.setup();
        const product: Product = {
            id: 123,
            name: "name",
            price: 12345,
            description: "description",
            color: "blue",
            material: "material",
        };

        const storeMap = {
            1: { count: 999, name: "name", price: 1123 },
            [product.id]: { count: 3, name: product.name, price: product.price },
        };

        const store = initStubStore(storeMap);
        const render = renderWithStubs(<ProductDetails product={product} />, store);
        const button = render.getByText("Add to Cart");

        await user.click(button);

        let validStore = {}
        Object.assign(validStore, storeMap);
        // @ts-ignore
        validStore[product.id].count++;

        expect(store.getState().cart).toEqual(validStore as CartState);
    });


});
