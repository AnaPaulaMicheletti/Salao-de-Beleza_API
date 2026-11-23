import type { Request, Response } from "express";
import ServiceService from "../services/ServiceService.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

async function getAll(req: Request, res: Response){
    try{
        const services = await ServiceService.getAll();
        res.status(200).json(services);

    }catch(error){
        console.log("Erro ao buscar serviços:", error);

        res.status(500).json({
            message: "Erro ao buscar serviços.",
        });
    }
}

async function getById(req: Request<{id: string}>, res: Response){
    const {id} = req.params;

    if(!id){
        return res.status(400).json({
            message: "ID do Serviço não informado.",
        });
    }

    try{
        const service = await ServiceService.getById(id);
        res.status(200).json({
            id: service.getId(),
            category_id: service.getCategoryId(),
            name: service.getName(),
            description: service.getDescription(),
            price: service.getPrice(),
            duration_minutes: service.getDurationMinutes(),
            active: service.isActive(),
        });

    }catch(error){
        console.log("Erro ao buscar serviço: ", error);

        if(error instanceof NotFoundError){
            return res.status(404).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao buscar serviço.",
        });
    }
}

async function create(req: Request, res: Response){
    try{
        const created = await ServiceService.create(req.body);

        res.status(201).json(created);

    }catch(error){
        console.log("Erro ao criar serviço: ", error);

        if(error instanceof ValidationError){
            return res.status(400).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao criar serviço.",
        });
    }
}

async function update(req: Request<{id: string}>, res: Response){
    const {id} = req.params;

    if(!id){
        return res.status(400).json({
            message: "ID do Serviço não informado.",
        });
    }

    try{
        const updated = await ServiceService.update(id, req.body);

        res.status(200).json(updated);

    }catch(error){
        console.log("Erro ao atualizar serviço: ", error);

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
            message: "Erro interno ao atualizar serviço.",
        });
    }
}

async function remove(req: Request<{id: string}>, res: Response){
    const {id} = req.params;

    if(!id){
        return res.status(400).json({
            message: "ID do Serviço não informado.",
        });
    }

    try{
        await ServiceService.remove(id);

        res.status(200).json({
            message: "Serviço removido com sucesso.",
        });

    }catch(error){
        console.log("Erro ao remover serviço: ", error);

        if(error instanceof NotFoundError){
            return res.status(404).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao remover serviço.",
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