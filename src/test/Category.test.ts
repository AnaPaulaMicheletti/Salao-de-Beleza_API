import { describe, it, expect } from "vitest";
import { Category } from "../models/Category.js";

describe("Category - Testes unitários", () => {

    it("deve criar uma categoria válida", () => {
        const name = "Cabelos";
        const description = "Corte, escova e tratamentos";

        const category = new Category(name, description);

        expect(category.getName()).toBe("Cabelos");
        expect(category.getDescription()).toBe("Corte, escova e tratamentos");
        expect(category.isActive()).toBe(true);
        expect(category.getId()).toBeUndefined();
    });


    it("não deve permitir criar uma categoria sem nome", () => {
        const name = "";

        expect(() => {
            new Category(name);
        }).toThrow("O nome da categoria é obrigatório.");
    });


    it("não deve permitir criar uma categoria com nome contendo apenas espaços", () => {
        const name = "        ";

        expect(() => {
            new Category(name);
        }).toThrow("O nome da categoria é obrigatório.");
    });


    it("deve remover o espaço antes e depois do nome de uma categoria", () => {
        const name = "   Cabelos   ";

        const category = new Category(name);

        expect(category.getName()).toBe("Cabelos");
    });


    it("deve permitir renomear uma categoria existente", () => {
        const category = new Category("Cabelos");

        category.rename("Unhas");

        expect(category.getName()).toBe("Unhas");
    });


    it("deve preservar o nome original após uma tentativa inválida de renomear", () => {
        const category = new Category("Cabelos");

        expect(() => {
            category.rename("");
        }).toThrow("O nome da categoria é obrigatório.");

        expect(category.getName()).toBe("Cabelos");
    });


    it("deve permitir desativar e reativar uma categoria", () => {
        const category = new Category("Cabelos");

        expect(category.isActive()).toBe(true);

        category.deactivate();

        expect(category.isActive()).toBe(false);

        category.activate();

        expect(category.isActive()).toBe(true);
    });


    it("deve restaurar uma categoria existente", () => {
        const id = "abc-123";
        const name = "Cabelos";
        const active = false;
        const description = "Corte, escova e tratamentos";

        const category = Category.restore(id, name, active, description);

        expect(category.getId()).toBe("abc-123");
        expect(category.getName()).toBe("Cabelos");
        expect(category.isActive()).toBe(false);
        expect(category.getDescription()).toBe("Corte, escova e tratamentos");
    });


    it("deve permitir alterar a descrição de uma categoria existente", () => {
        const category = new Category(
            "Cabelos",
            "Corte e escova",
        );

        category.changeDescription("Corte, escova e tratamentos");

        expect(category.getDescription()).toBe(
            "Corte, escova e tratamentos"
        );
    });
});