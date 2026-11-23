import { ValidationError } from "../errors/ValidationError.js";

export class Appointment{
    private id?: string | undefined;
    private service_id: string;
    private professional_id: string;
    private client_name: string;
    private client_phone: string;
    private appointment_date: string;
    private appointment_time: string;
    private status: string;

    constructor(
        service_id: string,
        professional_id: string,
        client_name: string,
        client_phone: string,
        appointment_date: string,
        appointment_time: string,
        status: string = "agendado"
    ){
        this.id = undefined;
        this.service_id = "";
        this.professional_id = "";
        this.client_name = "";
        this.client_phone = "";
        this.appointment_date = "";
        this.appointment_time = "";
        this.status = "agendado";

        this.changeService(service_id);
        this.changeProfessional(professional_id);
        this.changeClientName(client_name);
        this.changeClientPhone(client_phone);
        this.changeDate(appointment_date);
        this.changeTime(appointment_time);
        this.changeStatus(status);
    }

    static restore(
        id: string,
        service_id: string,
        professional_id: string,
        client_name: string,
        client_phone: string,
        appointment_date: string,
        appointment_time: string,
        status: string,
    ): Appointment{
        const appointment = new Appointment(
            service_id,
            professional_id,
            client_name,
            client_phone,
            appointment_date,
            appointment_time,
            status
        );

        appointment.id = id;

        return appointment;
    }

    public getId(): string | undefined{
        return this.id;
    }

    public getServiceId(): string{
        return this.service_id;
    }

    public getProfessionalId(): string{
        return this.professional_id;
    }

    public getClientName(): string{
        return this.client_name;
    }

    public getClientPhone(): string{
        return this.client_phone;
    }

    public getAppointmentDate(): string{
        return this.appointment_date;
    }

    public getAppointmentTime(): string{
        return this.appointment_time;
    }

    public getStatus(): string{
        return this.status;
    }

    //para trocar serviço, profissional, cliente, data, hora e status
    changeService(service_id: string): void{
        if(typeof service_id !== "string" || service_id.trim().length === 0){
            throw new ValidationError ("O serviço do agendamento é obrigatório.");
        }

        this.service_id = service_id.trim();
    }

    changeProfessional(professional_id: string): void{
        if(typeof professional_id !== "string" || professional_id.trim().length === 0){
            throw new ValidationError ("O profissional do agendamento é obrigatório.");
        }

        this.professional_id = professional_id.trim();
    }

    changeClientName(client_name: string): void{
        if(typeof client_name !== "string" || client_name.trim().length === 0){
            throw new ValidationError ("O nome do cliente é obrigatório.");
        }

        this.client_name = client_name.trim();
    }

    changeClientPhone(client_phone: string): void{
        if(typeof client_phone !== "string" || client_phone.trim().length === 0){
            throw new ValidationError ("O telefone do cliente é obrigatório.");
        }

        this.client_phone = client_phone.trim();
    }

    changeDate(appointment_date: string): void{
        if(typeof appointment_date !== "string" || appointment_date.trim().length === 0){
            throw new ValidationError ("A data do agendamento é obrigatória.");
        }

        this.appointment_date = appointment_date.trim();
    }

    changeTime(appointment_time: string): void{
        if(typeof appointment_time !== "string" || appointment_time.trim().length === 0){
            throw new ValidationError ("O horário do agendamento é obrigatório.");
        }

        this.appointment_time = appointment_time.trim();
    }

    changeStatus(status: string): void{
        if(typeof status !== "string" || status.trim().length === 0){
            throw new ValidationError ("O status do agendamento é obrigatório.");
        }

        this.status = status.trim();
    }
}