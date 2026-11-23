import { describe, it, expect } from "vitest";
import { Professional } from "../models/Professional.js";

describe("Professional - Testes unitários", () => {

    it("deve criar um profissional válido", () => {
        const name = "Camila Duarte";
        const specialty = "Cabeleireira";
        const phone = "41999999999";

        const professional = new Professional(name, specialty, phone);

        expect(professional.getName()).toBe("Camila Duarte");
        expect(professional.getSpecialty()).toBe("Cabeleireira");
        expect(professional.getPhone()).toBe("41999999999");
        expect(professional.isActive()).toBe(true);
        expect(professional.getId()).toBeUndefined();
    });


    it("não deve permitir criar um profissional sem nome", () => {
        const name = "";
        const specialty = "Cabeleireira";

        expect(() => {
            new Professional(name, specialty);
        }).toThrow("O nome do profissional é obrigatório.");
    });


    it("não deve permitir criar um profissional com nome contendo apenas espaços", () => {
        const name = "        ";
        const specialty = "Cabeleireira";

        expect(() => {
            new Professional(name, specialty);
        }).toThrow("O nome do profissional é obrigatório.");
    });


    it("não deve permitir criar um profissional sem especialidade", () => {
        const name = "Camila Duarte";
        const specialty = "";

        expect(() => {
            new Professional(name, specialty);
        }).toThrow("A especialidade do profissional é obrigatória.");
    });


    it("deve remover o espaço antes e depois do nome e da especialidade", () => {
        const name = "   Camila Duarte   ";
        const specialty = "   Cabeleireira   ";

        const professional = new Professional(name, specialty);

        expect(professional.getName()).toBe("Camila Duarte");
        expect(professional.getSpecialty()).toBe("Cabeleireira");
    });


    it("deve permitir renomear um profissional existente", () => {
        const professional = new Professional("Camila Duarte", "Cabeleireira");

        professional.rename("Bruna Lima");

        expect(professional.getName()).toBe("Bruna Lima");
    });


    it("deve preservar o nome original após uma tentativa inválida de renomear", () => {
        const professional = new Professional("Camila Duarte", "Cabeleireira");

        expect(() => {
            professional.rename("");
        }).toThrow("O nome do profissional é obrigatório.");

        expect(professional.getName()).toBe("Camila Duarte");
    });


    it("deve permitir alterar a especialidade de um profissional existente", () => {
        const professional = new Professional("Camila Duarte", "Cabeleireira");

        professional.changeSpecialty("Manicure");

        expect(professional.getSpecialty()).toBe("Manicure");
    });


    it("deve preservar a especialidade original após uma alteração inválida", () => {
        const professional = new Professional("Camila Duarte", "Cabeleireira");

        expect(() => {
            professional.changeSpecialty("");
        }).toThrow("A especialidade do profissional é obrigatória.");

        expect(professional.getSpecialty()).toBe("Cabeleireira");
    });


    it("deve permitir alterar o telefone de um profissional existente", () => {
        const professional = new Professional("Camila Duarte", "Cabeleireira", "41999999999");

        professional.changePhone("41888888888");

        expect(professional.getPhone()).toBe("41888888888");
    });


    it("deve permitir desativar e reativar um profissional", () => {
        const professional = new Professional("Camila Duarte", "Cabeleireira");

        expect(professional.isActive()).toBe(true);

        professional.deactivate();

        expect(professional.isActive()).toBe(false);

        professional.activate();

        expect(professional.isActive()).toBe(true);
    });


    it("deve restaurar um profissional existente", () => {
        const id = "abc-123";
        const name = "Camila Duarte";
        const specialty = "Cabeleireira";
        const active = false;
        const phone = "41999999999";

        const professional = Professional.restore(id, name, specialty, active, phone);

        expect(professional.getId()).toBe("abc-123");
        expect(professional.getName()).toBe("Camila Duarte");
        expect(professional.getSpecialty()).toBe("Cabeleireira");
        expect(professional.isActive()).toBe(false);
        expect(professional.getPhone()).toBe("41999999999");
    });
});