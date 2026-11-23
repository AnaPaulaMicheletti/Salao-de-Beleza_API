import { describe, it, expect } from "vitest";
import { Service } from "../models/Service.js";

describe("Service - Testes unitários", () => {

    it("deve criar um serviço válido", () => {
        const category_id = "cat-123";
        const name = "Corte feminino";
        const price = 80;
        const duration_minutes = 60;
        const description = "Corte feminino com finalização";

        const service = new Service(category_id, name, price, duration_minutes, description);

        expect(service.getCategoryId()).toBe("cat-123");
        expect(service.getName()).toBe("Corte feminino");
        expect(service.getPrice()).toBe(80);
        expect(service.getDurationMinutes()).toBe(60);
        expect(service.getDescription()).toBe("Corte feminino com finalização");
        expect(service.isActive()).toBe(true);
        expect(service.getId()).toBeUndefined();
    });


    it("não deve permitir criar um serviço sem nome", () => {
        const name = "";

        expect(() => {
            new Service("cat-123", name, 80, 60);
        }).toThrow("O nome do serviço é obrigatório.");
    });


    it("não deve permitir criar um serviço com nome contendo apenas espaços", () => {
        const name = "        ";

        expect(() => {
            new Service("cat-123", name, 80, 60);
        }).toThrow("O nome do serviço é obrigatório.");
    });


    it("não deve permitir criar um serviço sem categoria", () => {
        const category_id = "";

        expect(() => {
            new Service(category_id, "Corte feminino", 80, 60);
        }).toThrow("A categoria do serviço é obrigatória.");
    });


    it("deve remover o espaço antes e depois do nome de um serviço", () => {
        const name = "   Corte feminino   ";

        const service = new Service("cat-123", name, 80, 60);

        expect(service.getName()).toBe("Corte feminino");
    });


    it("não deve permitir preço negativo", () => {
        const price = -1;

        expect(() => {
            new Service("cat-123", "Corte feminino", price, 60);
        }).toThrow("O preço deve ser um número maior ou igual a zero.");
    });


    it("deve permitir preço igual a zero", () => {
        const price = 0;

        const service = new Service("cat-123", "Corte feminino", price, 60);

        expect(service.getPrice()).toBe(0);
    });


    it("não deve permitir duração igual a zero", () => {
        const duration_minutes = 0;

        expect(() => {
            new Service("cat-123", "Corte feminino", 80, duration_minutes);
        }).toThrow("A duração deve ser um número inteiro maior que zero.");
    });


    it("não deve permitir duração decimal", () => {
        const duration_minutes = 30.5;

        expect(() => {
            new Service("cat-123", "Corte feminino", 80, duration_minutes);
        }).toThrow("A duração deve ser um número inteiro maior que zero.");
    });


    it("deve permitir renomear um serviço existente", () => {
        const service = new Service("cat-123", "Corte feminino", 80, 60);

        service.rename("Corte masculino");

        expect(service.getName()).toBe("Corte masculino");
    });


    it("deve preservar o nome original após uma tentativa inválida de renomear", () => {
        const service = new Service("cat-123", "Corte feminino", 80, 60);

        expect(() => {
            service.rename("");
        }).toThrow("O nome do serviço é obrigatório.");

        expect(service.getName()).toBe("Corte feminino");
    });


    it("deve permitir alterar o preço de um serviço existente", () => {
        const service = new Service("cat-123", "Corte feminino", 80, 60);

        service.changePrice(120);

        expect(service.getPrice()).toBe(120);
    });


    it("deve preservar o preço original após uma alteração inválida", () => {
        const service = new Service("cat-123", "Corte feminino", 80, 60);

        expect(() => {
            service.changePrice(-10);
        }).toThrow("O preço deve ser um número maior ou igual a zero.");

        expect(service.getPrice()).toBe(80);
    });


    it("deve permitir alterar a duração de um serviço existente", () => {
        const service = new Service("cat-123", "Corte feminino", 80, 60);

        service.changeDuration(90);

        expect(service.getDurationMinutes()).toBe(90);
    });


    it("deve preservar a duração original após uma alteração inválida", () => {
        const service = new Service("cat-123", "Corte feminino", 80, 60);

        expect(() => {
            service.changeDuration(-5);
        }).toThrow("A duração deve ser um número inteiro maior que zero.");

        expect(service.getDurationMinutes()).toBe(60);
    });


    it("deve permitir alterar a categoria e a descrição de um serviço existente", () => {
        const service = new Service("cat-123", "Corte feminino", 80, 60, "Corte simples");

        service.changeCategory("cat-456");
        service.changeDescription("Corte feminino com finalização");

        expect(service.getCategoryId()).toBe("cat-456");
        expect(service.getDescription()).toBe("Corte feminino com finalização");
    });


    it("deve permitir desativar e reativar um serviço", () => {
        const service = new Service("cat-123", "Corte feminino", 80, 60);

        expect(service.isActive()).toBe(true);

        service.deactivate();

        expect(service.isActive()).toBe(false);

        service.activate();

        expect(service.isActive()).toBe(true);
    });


    it("deve restaurar um serviço existente", () => {
        const id = "abc-123";
        const category_id = "cat-123";
        const name = "Corte feminino";
        const price = 80;
        const duration_minutes = 60;
        const active = false;
        const description = "Corte feminino com finalização";

        const service = Service.restore(id, category_id, name, price, duration_minutes, active, description);

        expect(service.getId()).toBe("abc-123");
        expect(service.getCategoryId()).toBe("cat-123");
        expect(service.getName()).toBe("Corte feminino");
        expect(service.getPrice()).toBe(80);
        expect(service.getDurationMinutes()).toBe(60);
        expect(service.isActive()).toBe(false);
        expect(service.getDescription()).toBe("Corte feminino com finalização");
    });
});