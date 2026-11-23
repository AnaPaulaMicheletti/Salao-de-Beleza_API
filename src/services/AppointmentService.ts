import { Appointment } from "../models/Appointment.js";
import AppointmentRepository from "../repositories/AppointmentRepository.js";
import ServiceRepository from "../repositories/ServiceRepository.js";
import ProfessionalRepository from "../repositories/ProfessionalRepository.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ConflictError } from "../errors/ConflictError.js";

async function checkService(id: string){
    try{
        const service = await ServiceRepository.findById(id);

        if(!service.isActive()){
            throw new ValidationError("O serviço informado está inativo.");
        }
    }catch(error){
        if(error instanceof NotFoundError){
            throw new ValidationError("O serviço informado não existe.");
        }

        throw error;
    }
}

async function checkProfessional(id: string){
    try{
        const professional = await ProfessionalRepository.findById(id);

        if(!professional.isActive()){
            throw new ValidationError("O profissional informado está inativo.");
        }
    }catch(error){
        if(error instanceof NotFoundError){
            throw new ValidationError("O profissional informado não existe.");
        }

        throw error;
    }
}

async function checkConflict(appointment: Appointment, ignoreId?: string){
    if(appointment.getStatus() === "cancelado"){
        return;
    }

    const conflict = await AppointmentRepository.existsConflict(
        appointment.getProfessionalId(),
        appointment.getAppointmentDate(),
        appointment.getAppointmentTime(),
        ignoreId
    );

    if(conflict){
        throw new ConflictError("O profissional já possui um agendamento nesta data e horário.");
    }
}

async function getAll(){
    return AppointmentRepository.findAll();
}

async function getById(id: string){
    return AppointmentRepository.findById(id);
}

async function create(data: any){
    const appointment = new Appointment(
        data.service_id,
        data.professional_id,
        data.client_name,
        data.client_phone,
        data.appointment_date,
        data.appointment_time,
        data.status ?? "agendado"
    );

    await checkService(appointment.getServiceId());
    await checkProfessional(appointment.getProfessionalId());
    await checkConflict(appointment);

    return AppointmentRepository.create(appointment);
}

async function update(id: string, data: any){
    const appointment = await AppointmentRepository.findById(id);

    if(data.service_id !== undefined){
        appointment.changeService(data.service_id);
        await checkService(appointment.getServiceId());
    }

    if(data.professional_id !== undefined){
        appointment.changeProfessional(data.professional_id);
        await checkProfessional(appointment.getProfessionalId());
    }

    if(data.client_name !== undefined){
        appointment.changeClientName(data.client_name);
    }

    if(data.client_phone !== undefined){
        appointment.changeClientPhone(data.client_phone);
    }

    if(data.appointment_date !== undefined){
        appointment.changeDate(data.appointment_date);
    }

    if(data.appointment_time !== undefined){
        appointment.changeTime(data.appointment_time);
    }

    if(data.status !== undefined){
        appointment.changeStatus(data.status);
    }

    await checkConflict(appointment, id);

    return AppointmentRepository.update(appointment);
}

async function remove(id: string){
    return AppointmentRepository.remove(id);
}

export default{
    getAll,
    getById,
    create,
    update,
    remove,
};