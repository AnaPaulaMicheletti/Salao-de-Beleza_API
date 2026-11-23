import { describe, it, expect, vi, beforeEach } from "vitest";
import AppointmentService from "./AppointmentService.js";
import AppointmentRepository from "../repositories/AppointmentRepository.js";
import ServiceRepository from "../repositories/ServiceRepository.js";
import ProfessionalRepository from "../repositories/ProfessionalRepository.js";
import { Appointment } from "../models/Appointment.js";
import { Service } from "../models/Service.js";
import { Professional } from "../models/Professional.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ConflictError } from "../errors/ConflictError.js";

vi.mock("../repositories/AppointmentRepository.js", () => ({
    default: {
        findAll: vi.fn(),
        findById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        existsConflict: vi.fn(),
    },
}));

vi.mock("../repositories/ServiceRepository.js", () => ({
    default: { findById: vi.fn() },
}));

vi.mock("../repositories/ProfessionalRepository.js", () => ({
    default: { findById: vi.fn() },
}));

const validData = {
    service_id: "s1",
    professional_id: "p1",
    client_name: "João",
    client_phone: "41999999999",
    appointment_date: "2026-12-01",
    appointment_time: "14:30",
};

const activeService = Service.restore("s1", "c1", "Corte", 50, 30, true);
const inactiveService = Service.restore("s1", "c1", "Corte", 50, 30, false);
const activeProfessional = Professional.restore("p1", "Ana", "Cabelo", true);
const inactiveProfessional = Professional.restore("p1", "Ana", "Cabelo", false);

describe("AppointmentService", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe("create", () => {
        it("cria o agendamento quando serviço e profissional estão ativos e não há conflito", async () => {
            vi.mocked(ServiceRepository.findById).mockResolvedValue(activeService);
            vi.mocked(ProfessionalRepository.findById).mockResolvedValue(activeProfessional);
            vi.mocked(AppointmentRepository.existsConflict).mockResolvedValue(false);
            vi.mocked(AppointmentRepository.create).mockResolvedValue({ id: "a1" });

            const result = await AppointmentService.create(validData);

            expect(result).toEqual({ id: "a1" });
            expect(AppointmentRepository.create).toHaveBeenCalledTimes(1);
        });

        it("lança ValidationError quando o serviço não existe", async () => {
            vi.mocked(ServiceRepository.findById).mockRejectedValue(new NotFoundError("Serviço não encontrado."));

            await expect(AppointmentService.create(validData)).rejects.toThrow("O serviço informado não existe.");
            expect(AppointmentRepository.create).not.toHaveBeenCalled();
        });

        it("lança ValidationError quando o serviço está inativo", async () => {
            vi.mocked(ServiceRepository.findById).mockResolvedValue(inactiveService);

            await expect(AppointmentService.create(validData)).rejects.toThrow(ValidationError);
            expect(AppointmentRepository.create).not.toHaveBeenCalled();
        });

        it("lança ValidationError quando o profissional está inativo", async () => {
            vi.mocked(ServiceRepository.findById).mockResolvedValue(activeService);
            vi.mocked(ProfessionalRepository.findById).mockResolvedValue(inactiveProfessional);

            await expect(AppointmentService.create(validData)).rejects.toThrow("O profissional informado está inativo.");
            expect(AppointmentRepository.create).not.toHaveBeenCalled();
        });

        it("lança ConflictError quando o profissional já tem agendamento no mesmo horário", async () => {
            vi.mocked(ServiceRepository.findById).mockResolvedValue(activeService);
            vi.mocked(ProfessionalRepository.findById).mockResolvedValue(activeProfessional);
            vi.mocked(AppointmentRepository.existsConflict).mockResolvedValue(true);

            await expect(AppointmentService.create(validData)).rejects.toThrow(ConflictError);
            expect(AppointmentRepository.create).not.toHaveBeenCalled();
        });

        it("lança ValidationError quando o nome do cliente é vazio", async () => {
            await expect(
                AppointmentService.create({ ...validData, client_name: "" })
            ).rejects.toThrow(ValidationError);

            expect(AppointmentRepository.create).not.toHaveBeenCalled();
        });
    });

    describe("update", () => {
        const existing = () =>
            Appointment.restore("a1", "s1", "p1", "João", "41999999999", "2026-12-01", "14:30", "agendado");

        it("atualiza o agendamento quando não há conflito", async () => {
            vi.mocked(AppointmentRepository.findById).mockResolvedValue(existing());
            vi.mocked(AppointmentRepository.existsConflict).mockResolvedValue(false);
            vi.mocked(AppointmentRepository.update).mockResolvedValue({ id: "a1" });

            const result = await AppointmentService.update("a1", { appointment_time: "16:00" });

            expect(result).toEqual({ id: "a1" });
            expect(AppointmentRepository.existsConflict).toHaveBeenCalledWith("p1", "2026-12-01", "16:00", "a1");
        });

        it("lança ConflictError ao mover para um horário já ocupado", async () => {
            vi.mocked(AppointmentRepository.findById).mockResolvedValue(existing());
            vi.mocked(AppointmentRepository.existsConflict).mockResolvedValue(true);

            await expect(
                AppointmentService.update("a1", { appointment_time: "16:00" })
            ).rejects.toThrow(ConflictError);

            expect(AppointmentRepository.update).not.toHaveBeenCalled();
        });

        it("não verifica conflito quando o agendamento é cancelado", async () => {
            vi.mocked(AppointmentRepository.findById).mockResolvedValue(existing());
            vi.mocked(AppointmentRepository.update).mockResolvedValue({ id: "a1" });

            await AppointmentService.update("a1", { status: "cancelado" });

            expect(AppointmentRepository.existsConflict).not.toHaveBeenCalled();
        });

        it("propaga NotFoundError quando o agendamento não existe", async () => {
            vi.mocked(AppointmentRepository.findById).mockRejectedValue(new NotFoundError("Agendamento não encontrado."));

            await expect(
                AppointmentService.update("x", { client_name: "Maria" })
            ).rejects.toThrow(NotFoundError);
        });
    });
});