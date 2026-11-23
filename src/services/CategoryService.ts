import { Category } from "../models/Category.js";
import CategoryRepository from "../repositories/CategoryRepository.js";

async function getAll(){
    return CategoryRepository.findAll();
}

async function getById(id: string){
    return CategoryRepository.findById(id);
}

async function create(data: any){
    const category = new Category(data.name, data.description);

    return CategoryRepository.create(category);
}

async function update(id: string, data: any){
    const category = await CategoryRepository.findById(id);

    if(data.name !== undefined){
        category.rename(data.name);
    }

    if(data.description !== undefined){
        category.changeDescription(data.description);
    }

    if(data.active === true){
        category.activate();
    }

    if(data.active === false){
        category.deactivate();
    }

    return CategoryRepository.update(category);
}

async function remove(id: string){
    return CategoryRepository.remove(id);
}

export default{
    getAll,
    getById,
    create,
    update,
    remove,
};