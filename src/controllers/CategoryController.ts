import type { Request, Response } from "express";
import CategoryService from "../services/CategoryService.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

async function getAll(req: Request, res: Response){
    try{
        const categories = await CategoryService.getAll();
        res.status(200).json(categories);

    }catch(error){
        console.log("Erro ao buscar categorias:", error);

        res.status(500).json({
            message: "Erro ao buscar categorias.",
        });
    }
}

async function getById(req: Request<{id: string}>, res: Response){
    const {id} = req.params;

    if(!id){
        return res.status(400).json({
            message: "ID da Categoria não informado.",
        });
    }

    try{
        const category = await CategoryService.getById(id);
        res.status(200).json({
            id: category.getId(),
            name: category.getName(),
            description: category.getDescription(),
            active: category.isActive(),
        });

    }catch(error){
        console.log("Erro ao buscar categoria: ", error);

        if(error instanceof NotFoundError){
            return res.status(404).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao buscar categoria.",
        });
    }
}

async function create(req: Request, res: Response){
    try{
        const created = await CategoryService.create(req.body);

        res.status(201).json(created);

    }catch(error){
        console.log("Erro ao criar categoria: ", error);

        if(error instanceof ValidationError){
            return res.status(400).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao criar categoria.",
        });
    }
}

async function update(req: Request<{id: string}>, res: Response){
    const {id} = req.params;

    if(!id){
        return res.status(400).json({
            message: "ID da Categoria não informado.",
        });
    }

    try{
        const updated = await CategoryService.update(id, req.body);

        res.status(200).json(updated);

    }catch(error){
        console.log("Erro ao atualizar categoria: ", error);

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
            message: "Erro interno ao atualizar categoria.",
        });
    }
}

async function remove(req: Request<{id: string}>, res: Response){
    const {id} = req.params;

    if(!id){
        return res.status(400).json({  
            message: "ID da Categoria não informado.",
        });
    }

    try{
        await CategoryService.remove(id);

        res.status(200).json({
            message: "Categoria removida com sucesso.",
        });

    }catch(error){
        console.log("Erro ao remover categoria: ", error);

        if(error instanceof NotFoundError){
            return res.status(404).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Erro interno ao remover categoria.",
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