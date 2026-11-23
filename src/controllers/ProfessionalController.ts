import type { Request, Response } from "express";
import ProfessionalService from "../services/ProfessionalService.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

async function getAll(req: Request, res: Response){
    try{
        const professionals = await ProfessionalService.getAll();
        res.status(200).json(professionals);

    }catch(error){
        console.log("Erro ao buscar profissionais:", error);

        res.status(500).json({
            message: "Erro ao buscar profissionais.",
        });
    }
}

async function getById(req: Request<{id: string}>, res: Response){
    const {id} = req.params;

    if(!id){
        return res.status(400).json({
            message: "ID do Profissional não informado.",
        });
    }

    try{
        const professional = await ProfessionalService.getById(id);
        res.status(200).json({
            id: professional.getId(),
            name: professional.getName(),
            specialty: professional.getSpecialty(),
            phone: professional.getPhone(),
            active: professional.isActive(),
        });

    }catch(error){
        console.log("Erro ao buscar profissional: ", error);

        if(error instanceof NotFoundError){
            return res.status(404).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao buscar profissional.",
        });
    }
}

async function create(req: Request, res: Response){
    try{
        const created = await ProfessionalService.create(req.body);

        res.status(201).json(created);

    }catch(error){
        console.log("Erro ao criar profissional: ", error);

        if(error instanceof ValidationError){
            return res.status(400).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao criar profissional.",
        });
    }
}

async function update(req: Request<{id: string}>, res: Response){
    const {id} = req.params;

    if(!id){
        return res.status(400).json({
            message: "ID do Profissional não informado.",
        });
    }

    try{
        const updated = await ProfessionalService.update(id, req.body);

        res.status(200).json(updated);

    }catch(error){
        console.log("Erro ao atualizar profissional: ", error);

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

        res.status(500).json({
            message: "Erro interno ao atualizar profissional.",
        });
    }
}

async function remove(req: Request<{id: string}>, res: Response){
    const {id} = req.params;

    if(!id){
        return res.status(400).json({
            message: "ID do Profissional não informado.",
        });
    }

    try{
        await ProfessionalService.remove(id);

        res.status(200).json({
            message: "Profissional removido com sucesso.",
        });

    }catch(error){
        console.log("Erro ao remover profissional: ", error);

        if(error instanceof NotFoundError){
            return res.status(404).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao remover profissional.",
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