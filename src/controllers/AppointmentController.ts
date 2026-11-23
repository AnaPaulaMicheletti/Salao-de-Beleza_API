import type { Request, Response } from "express";
import AppointmentService from "../services/AppointmentService.js";
import { ConflictError } from "../errors/ConflictError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

async function getAll(req: Request, res: Response){
    try{
        const appointments = await AppointmentService.getAll();
        res.status(200).json(appointments);

    }catch(error){
        console.log("Erro ao buscar agendamentos:", error);

        res.status(500).json({
            message: "Erro ao buscar agendamentos.",
        });
    }
}

async function getById(req: Request<{id: string}>, res: Response){
    const {id} = req.params;

    if(!id){
        return res.status(400).json({
            message: "ID do Agendamento não informado.",
        });
    }

    try{
        const appointment = await AppointmentService.getById(id);
        res.status(200).json({
            id: appointment.getId(),
            service_id: appointment.getServiceId(),
            professional_id: appointment.getProfessionalId(),
            client_name: appointment.getClientName(),
            client_phone: appointment.getClientPhone(),
            appointment_date: appointment.getAppointmentDate(),
            appointment_time: appointment.getAppointmentTime(),
            status: appointment.getStatus(),
        });

    }catch(error){
        console.log("Erro ao buscar agendamento: ", error);

        if(error instanceof NotFoundError){
            return res.status(404).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao buscar agendamento.",
        });
    }
}

async function create(req: Request, res: Response){
    try{
        const created = await AppointmentService.create(req.body);

        res.status(201).json(created);

    }catch(error){
        console.log("Erro ao criar agendamento: ", error);

        if(error instanceof ValidationError){
            return res.status(400).json({
                message: error.message,
            });
        }

        if(error instanceof ConflictError){
            return res.status(409).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao criar agendamento.",
        });
    }
}

async function update(req: Request<{id: string}>, res: Response){
    const {id} = req.params;

    if(!id){
        return res.status(400).json({
            message: "ID do Agendamento não informado.",
        });
    }

    try{
        const updated = await AppointmentService.update(id, req.body);

        res.status(200).json(updated);

    }catch(error){
        console.log("Erro ao atualizar agendamento: ", error);

        if(error instanceof ValidationError){
            return res.status(400).json({
                message: error.message,
            });
        }

        if(error instanceof NotFoundError){
            return res.status(404).json({
                message: error.message,
            });
        }

        if(error instanceof ConflictError){
            return res.status(409).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao atualizar agendamento.",
        });
    }
}

async function remove(req: Request<{id: string}>, res: Response){
    const {id} = req.params;

    if(!id){
        return res.status(400).json({
            message: "ID do Agendamento não informado.",
        });
    }

    try{
        await AppointmentService.remove(id);

        res.status(200).json({
            message: "Agendamento removido com sucesso.",
        });

    }catch(error){
        console.log("Erro ao remover agendamento: ", error);

        if(error instanceof NotFoundError){
            return res.status(404).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao remover agendamento.",
        });
    }
}

export default{
    getAll,
    getById,
    create,
    update,
    remove,
};