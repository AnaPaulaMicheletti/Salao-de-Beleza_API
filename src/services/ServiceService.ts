import { Service } from "../models/Service.js";
import ServiceRepository from "../repositories/ServiceRepository.js";

async function getAll(){
    return ServiceRepository.findAll();
}

async function getById(id: string){
    return ServiceRepository.findById(id);
}

async function create(data: any){
    const service = new Service(
        data.category_id,
        data.name,
        Number(data.price),
        Number(data.duration_minutes),
        data.description
    );

    return ServiceRepository.create(service);
}

async function update(id: string, data: any){
    const service = await ServiceRepository.findById(id);

    if(data.category_id !== undefined){
        service.changeCategory(data.category_id);
    }

    if(data.name !== undefined){
        service.rename(data.name);
    }

    if(data.description !== undefined){
        service.changeDescription(data.description);
    }

    if(data.price !== undefined){
        service.changePrice(Number(data.price));
    }

    if(data.duration_minutes !== undefined){
        service.changeDuration(Number(data.duration_minutes));
    }

    if(data.active === true){
        service.activate();
    }

    if(data.active === false){
        service.deactivate();
    }

    return ServiceRepository.update(service);
}

async function remove(id: string){
    return ServiceRepository.remove(id);
}

export default{
    getAll,
    getById,
    create,
    update,
    remove,
};