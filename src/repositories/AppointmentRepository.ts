import supabase from "../config/supabase.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { Appointment } from "../models/Appointment.js";

async function findAll(){
    const{data, error} =  await supabase
    .from("appointments")
    .select("*, services(name), professionals(name, specialty)")
    .order("appointment_date")
    .order("appointment_time");

    if(error){
        throw error;
    }
    return data;
}

async function findById(id: string): Promise<Appointment> {
    const{data, error} =  await supabase
    .from("appointments")
    .select("*")
    .eq("id", id)
    .maybeSingle();

    if(error){
        throw error;
    }

    if(!data){
        throw new NotFoundError("Agendamento não encontrado.");
    }

    return Appointment.restore(
        data.id,
        data.service_id,
        data.professional_id,
        data.client_name,
        data.client_phone,
        data.appointment_date,
        data.appointment_time,
        data.status,
    );
}

async function create(appointment: Appointment){
    const{data, error} =  await supabase
    .from("appointments")
    .insert({
        service_id: appointment.getServiceId(),
        professional_id: appointment.getProfessionalId(),
        client_name: appointment.getClientName(),
        client_phone: appointment.getClientPhone(),
        appointment_date: appointment.getAppointmentDate(),
        appointment_time: appointment.getAppointmentTime(),
        status: appointment.getStatus(),
    })
    .select()
    .single();

    if(error){
        throw error;
    }
    return data;
}

async function update(appointment: Appointment){
    const id = appointment.getId();

    if(!id){
        throw new Error("Agendamento sem ID não pode ser atualizado.");
    }

    const{data, error} =  await supabase
    .from("appointments")
    .update({
        service_id: appointment.getServiceId(),
        professional_id: appointment.getProfessionalId(),
        client_name: appointment.getClientName(),
        client_phone: appointment.getClientPhone(),
        appointment_date: appointment.getAppointmentDate(),
        appointment_time: appointment.getAppointmentTime(),
        status: appointment.getStatus(),
    })
    .eq("id", id)
    .select()
    .single();

    if(error){
        throw error;
    }

    if(!data){
        throw new NotFoundError("Agendamento não encontrado.");
    }

    return data;
}

async function remove(id: string){
    const{data, error} =  await supabase
    .from("appointments")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

    if(error){
        throw error;
    }

    if(!data){
        throw new NotFoundError("Agendamento não encontrado.");
    }

    return data;
}

async function existsConflict(professional_id: string, date: string, time: string, ignoreId?: string): Promise<boolean>{
    let query = supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("professional_id", professional_id)
    .eq("appointment_date", date)
    .eq("appointment_time", time)
    .neq("status", "cancelado");

    if(ignoreId){
        query = query.neq("id", ignoreId);
    }

    const { count, error } = await query;

    if(error){
        throw error;
    }

    return (count ?? 0) > 0;
}

export default{
    findAll,
    findById,
    create,
    update,
    remove,
    existsConflict,
};