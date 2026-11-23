import { describe, it, expect } from "vitest";
import { Appointment } from "../models/Appointment.js";

describe("Appointment - Testes unitários", () => {

    function makeAppointment(){
        return new Appointment(
            "service-123",
            "professional-123",
            "Pandora Zuzu",
            "41999999999",
            "2026-12-10",
            "14:30",
        );
    }

    it("deve criar um agendamento válido", () => {
        const appointment = makeAppointment();

        expect(appointment.getServiceId()).toBe("service-123");
        expect(appointment.getProfessionalId()).toBe("professional-123");
        expect(appointment.getClientName()).toBe("Pandora Zuzu");
        expect(appointment.getClientPhone()).toBe("41999999999");
        expect(appointment.getAppointmentDate()).toBe("2026-12-10");
        expect(appointment.getAppointmentTime()).toBe("14:30");
        expect(appointment.getStatus()).toBe("agendado");
        expect(appointment.getId()).toBeUndefined();
    });


    it("deve permitir criar um agendamento com status informado", () => {
        const appointment = new Appointment(
            "service-123",
            "professional-123",
            "Pandora Zuzu",
            "41999999999",
            "2026-12-10",
            "14:30",
            "concluido",
        );

        expect(appointment.getStatus()).toBe("concluido");
    });


    it("não deve permitir criar um agendamento sem serviço", () => {
        expect(() => {
            new Appointment("", "professional-123", "Pandora Zuzu", "41999999999", "2026-12-10", "14:30");
        }).toThrow("O serviço do agendamento é obrigatório.");
    });


    it("não deve permitir criar um agendamento sem profissional", () => {
        expect(() => {
            new Appointment("service-123", "", "Pandora Zuzu", "41999999999", "2026-12-10", "14:30");
        }).toThrow("O profissional do agendamento é obrigatório.");
    });


    it("não deve permitir criar um agendamento sem nome do cliente", () => {
        expect(() => {
            new Appointment("service-123", "professional-123", "", "41999999999", "2026-12-10", "14:30");
        }).toThrow("O nome do cliente é obrigatório.");
    });


    it("não deve permitir criar um agendamento com nome do cliente contendo apenas espaços", () => {
        expect(() => {
            new Appointment("service-123", "professional-123", "        ", "41999999999", "2026-12-10", "14:30");
        }).toThrow("O nome do cliente é obrigatório.");
    });


    it("não deve permitir criar um agendamento sem telefone do cliente", () => {
        expect(() => {
            new Appointment("service-123", "professional-123", "Pandora Zuzu", "", "2026-12-10", "14:30");
        }).toThrow("O telefone do cliente é obrigatório.");
    });


    it("não deve permitir criar um agendamento sem data", () => {
        expect(() => {
            new Appointment("service-123", "professional-123", "Pandora Zuzu", "41999999999", "", "14:30");
        }).toThrow("A data do agendamento é obrigatória.");
    });


    it("não deve permitir criar um agendamento sem horário", () => {
        expect(() => {
            new Appointment("service-123", "professional-123", "Pandora Zuzu", "41999999999", "2026-12-10", "");
        }).toThrow("O horário do agendamento é obrigatório.");
    });


    it("não deve permitir criar um agendamento com status vazio", () => {
        expect(() => {
            new Appointment("service-123", "professional-123", "Pandora Zuzu", "41999999999", "2026-12-10", "14:30", "");
        }).toThrow("O status do agendamento é obrigatório.");
    });


    it("deve remover o espaço antes e depois do nome do cliente", () => {
        const appointment = new Appointment(
            "service-123",
            "professional-123",
            "   Pandora Zuzu   ",
            "41999999999",
            "2026-12-10",
            "14:30",
        );

        expect(appointment.getClientName()).toBe("Pandora Zuzu");
    });


    it("deve permitir alterar o nome do cliente de um agendamento existente", () => {
        const appointment = makeAppointment();

        appointment.changeClientName("Maria Souza");

        expect(appointment.getClientName()).toBe("Maria Souza");
    });


    it("deve preservar o nome do cliente original após uma alteração inválida", () => {
        const appointment = makeAppointment();

        expect(() => {
            appointment.changeClientName("");
        }).toThrow("O nome do cliente é obrigatório.");

        expect(appointment.getClientName()).toBe("Pandora Zuzu");
    });


    it("deve permitir alterar o serviço e o profissional de um agendamento existente", () => {
        const appointment = makeAppointment();

        appointment.changeService("service-456");
        appointment.changeProfessional("professional-456");

        expect(appointment.getServiceId()).toBe("service-456");
        expect(appointment.getProfessionalId()).toBe("professional-456");
    });


    it("deve permitir alterar o telefone do cliente de um agendamento existente", () => {
        const appointment = makeAppointment();

        appointment.changeClientPhone("41888888888");

        expect(appointment.getClientPhone()).toBe("41888888888");
    });


    it("deve permitir alterar a data e o horário de um agendamento existente", () => {
        const appointment = makeAppointment();

        appointment.changeDate("2026-12-11");
        appointment.changeTime("15:30");

        expect(appointment.getAppointmentDate()).toBe("2026-12-11");
        expect(appointment.getAppointmentTime()).toBe("15:30");
    });


    it("deve preservar a data original após uma alteração inválida", () => {
        const appointment = makeAppointment();

        expect(() => {
            appointment.changeDate("");
        }).toThrow("A data do agendamento é obrigatória.");

        expect(appointment.getAppointmentDate()).toBe("2026-12-10");
    });


    it("deve permitir alterar o status de um agendamento existente", () => {
        const appointment = makeAppointment();

        expect(appointment.getStatus()).toBe("agendado");

        appointment.changeStatus("cancelado");

        expect(appointment.getStatus()).toBe("cancelado");
    });


    it("deve restaurar um agendamento existente", () => {
        const id = "abc-123";

        const appointment = Appointment.restore(
            id,
            "service-123",
            "professional-123",
            "Pandora Zuzu",
            "41999999999",
            "2026-12-10",
            "14:30",
            "concluido",
        );

        expect(appointment.getId()).toBe("abc-123");
        expect(appointment.getServiceId()).toBe("service-123");
        expect(appointment.getProfessionalId()).toBe("professional-123");
        expect(appointment.getClientName()).toBe("Pandora Zuzu");
        expect(appointment.getClientPhone()).toBe("41999999999");
        expect(appointment.getAppointmentDate()).toBe("2026-12-10");
        expect(appointment.getAppointmentTime()).toBe("14:30");
        expect(appointment.getStatus()).toBe("concluido");
    });
});