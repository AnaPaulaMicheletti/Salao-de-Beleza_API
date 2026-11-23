import { describe, it, expect, vi, beforeEach } from "vitest";
import ServiceService from "./ServiceService.js";
import ServiceRepository from "../repositories/ServiceRepository.js";
import { Service } from "../models/Service.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

vi.mock("../repositories/ServiceRepository.js", () => ({
    default: {
        findAll: vi.fn(),
        findById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
    },
}));

const validData = {
    category_id: "c1",
    name: "Corte",
    price: 50,
    duration_minutes: 30,
};

describe("ServiceService", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("cria um serviço com dados válidos", async () => {
        vi.mocked(ServiceRepository.create).mockResolvedValue({ id: "s1" });

        const result = await ServiceService.create(validData);

        expect(result).toEqual({ id: "s1" });
        expect(ServiceRepository.create).toHaveBeenCalledTimes(1);
    });

    it("lança ValidationError ao criar serviço com preço negativo", async () => {
        await expect(
            ServiceService.create({ ...validData, price: -10 })
        ).rejects.toThrow(ValidationError);

        expect(ServiceRepository.create).not.toHaveBeenCalled();
    });

    it("lança ValidationError ao criar serviço com duração zero", async () => {
        await expect(
            ServiceService.create({ ...validData, duration_minutes: 0 })
        ).rejects.toThrow(ValidationError);
    });

    it("lança ValidationError ao atualizar com preço inválido (texto)", async () => {
        vi.mocked(ServiceRepository.findById).mockResolvedValue(
            Service.restore("s1", "c1", "Corte", 50, 30, true)
        );

        await expect(
            ServiceService.update("s1", { price: "abc" })
        ).rejects.toThrow(ValidationError);

        expect(ServiceRepository.update).not.toHaveBeenCalled();
    });

    it("propaga NotFoundError ao atualizar serviço inexistente", async () => {
        vi.mocked(ServiceRepository.findById).mockRejectedValue(new NotFoundError("Serviço não encontrado."));

        await expect(
            ServiceService.update("x", { name: "Novo" })
        ).rejects.toThrow(NotFoundError);
    });
});