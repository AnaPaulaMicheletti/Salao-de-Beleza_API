import { Professional } from "../models/Professional.js";
import ProfessionalRepository from "../repositories/ProfessionalRepository.js";

async function getAll(){
    return ProfessionalRepository.findAll();
}

async function getById(id: string){
    return ProfessionalRepository.findById(id);
}

async function create(data: any){
    const professional = new Professional(data.name, data.specialty, data.phone);

    return ProfessionalRepository.create(professional);
}

async function update(id: string, data: any){
    const professional = await ProfessionalRepository.findById(id);

    if(data.name !== undefined){
        professional.rename(data.name);
    }

    if(data.specialty !== undefined){
        professional.changeSpecialty(data.specialty);
    }

    if(data.phone !== undefined){
        professional.changePhone(data.phone);
    }

    if(data.active === true){
        professional.activate();
    }

    if(data.active === false){
        professional.deactivate();
    }

    return ProfessionalRepository.update(professional);
}

async function remove(id: string){
    return ProfessionalRepository.remove(id);
}

export default{
    getAll,
    getById,
    create,
    update,
    remove,
};