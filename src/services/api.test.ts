import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import CategoryRepository from "../repositories/CategoryRepository.js";
import ServiceRepository from "../repositories/ServiceRepository.js";
import ProfessionalRepository from "../repositories/ProfessionalRepository.js";
import AppointmentRepository from "../repositories/AppointmentRepository.js";
import { Category } from "../models/Category.js";
import { Service } from "../models/Service.js";
import { Professional } from "../models/Professional.js";
import { NotFoundError } from "../errors/NotFoundError.js";

vi.mock("../repositories/CategoryRepository.js", () => ({
    default: { findAll: vi.fn(), findById: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() },
}));

vi.mock("../repositories/ServiceRepository.js", () => ({
    default: { findAll: vi.fn(), findById: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() },
}));

vi.mock("../repositories/ProfessionalRepository.js", () => ({
    default: { findAll: vi.fn(), findById: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() },
}));

vi.mock("../repositories/AppointmentRepository.js", () => ({
    default: {
        findAll: vi.fn(), findById: vi.fn(), create: vi.fn(),
        update: vi.fn(), remove: vi.fn(), existsConflict: vi.fn(),
    },
}));

const appointmentBody = {
    service_id: "s1",
    professional_id: "p1",
    client_name: "João",
    client_phone: "41999999999",
    appointment_date: "2026-12-01",
    appointment_time: "14:30",
};

describe("API - integração", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe("Categories", () => {
        it("GET /categories retorna 200 e a lista", async () => {
            vi.mocked(CategoryRepository.findAll).mockResolvedValue([{ id: "c1", name: "Cabelos" }]);

            const res = await request(app).get("/categories");

            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id: "c1", name: "Cabelos" }]);
        });

        it("GET /categories/:id retorna 200 com a categoria", async () => {
            vi.mocked(CategoryRepository.findById).mockResolvedValue(
                Category.restore("c1", "Cabelos", true, "Corte e escova")
            );

            const res = await request(app).get("/categories/c1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ id: "c1", name: "Cabelos", description: "Corte e escova", active: true });
        });

        it("GET /categories/:id retorna 404 quando não existe", async () => {
            vi.mocked(CategoryRepository.findById).mockRejectedValue(new NotFoundError("Categoria não encontrada."));

            const res = await request(app).get("/categories/x");

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: "Categoria não encontrada." });
        });

        it("POST /categories retorna 201 com dados válidos", async () => {
            vi.mocked(CategoryRepository.create).mockResolvedValue({ id: "c1", name: "Unhas" });

            const res = await request(app).post("/categories").send({ name: "Unhas" });

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ id: "c1", name: "Unhas" });
        });

        it("POST /categories retorna 400 quando o nome é vazio", async () => {
            const res = await request(app).post("/categories").send({ name: "" });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("O nome da categoria é obrigatório.");
        });

        it("POST /categories retorna 400 em JSON malformado", async () => {
            const res = await request(app)
                .post("/categories")
                .set("Content-Type", "application/json")
                .send("{invalido");

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: "JSON inválido." });
        });

        it("DELETE /categories/:id retorna 200 ao remover", async () => {
            vi.mocked(CategoryRepository.remove).mockResolvedValue({ id: "c1" });

            const res = await request(app).delete("/categories/c1");

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: "Categoria removida com sucesso." });
        });
    });

    describe("Services", () => {
        it("POST /services retorna 400 com preço negativo", async () => {
            const res = await request(app)
                .post("/services")
                .send({ category_id: "c1", name: "Corte", price: -5, duration_minutes: 30 });

            expect(res.status).toBe(400);
        });

        it("PUT /services/:id retorna 404 quando não existe", async () => {
            vi.mocked(ServiceRepository.findById).mockRejectedValue(new NotFoundError("Serviço não encontrado."));

            const res = await request(app).put("/services/x").send({ name: "Novo" });

            expect(res.status).toBe(404);
        });
    });

    describe("Appointments", () => {
        function mockValidDependencies(){
            vi.mocked(ServiceRepository.findById).mockResolvedValue(Service.restore("s1", "c1", "Corte", 50, 30, true));
            vi.mocked(ProfessionalRepository.findById).mockResolvedValue(Professional.restore("p1", "Ana", "Cabelo", true));
        }

        it("POST /appointments retorna 201 quando não há conflito", async () => {
            mockValidDependencies();
            vi.mocked(AppointmentRepository.existsConflict).mockResolvedValue(false);
            vi.mocked(AppointmentRepository.create).mockResolvedValue({ id: "a1" });

            const res = await request(app).post("/appointments").send(appointmentBody);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ id: "a1" });
        });

        it("POST /appointments retorna 409 quando o horário já está ocupado", async () => {
            mockValidDependencies();
            vi.mocked(AppointmentRepository.existsConflict).mockResolvedValue(true);

            const res = await request(app).post("/appointments").send(appointmentBody);

            expect(res.status).toBe(409);
            expect(AppointmentRepository.create).not.toHaveBeenCalled();
        });

        it("POST /appointments retorna 400 quando o serviço não existe", async () => {
            vi.mocked(ServiceRepository.findById).mockRejectedValue(new NotFoundError("Serviço não encontrado."));

            const res = await request(app).post("/appointments").send(appointmentBody);

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("O serviço informado não existe.");
        });

        it("POST /appointments retorna 400 sem o nome do cliente", async () => {
            const res = await request(app)
                .post("/appointments")
                .send({ ...appointmentBody, client_name: "" });

            expect(res.status).toBe(400);
        });

        it("DELETE /appointments/:id retorna 404 quando não existe", async () => {
            vi.mocked(AppointmentRepository.remove).mockRejectedValue(new NotFoundError("Agendamento não encontrado."));

            const res = await request(app).delete("/appointments/x");

            expect(res.status).toBe(404);
        });
    });
});