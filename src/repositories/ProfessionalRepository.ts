import supabase from "../config/supabase.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { Professional } from "../models/Professional.js";

async function findAll(){
    const{data, error} =  await supabase
    .from("professionals")
    .select("*")
    .order("name");

    if(error){
        throw error;
    }
    return data;
}

async function findById(id: string): Promise<Professional> {
    const{data, error} =  await supabase
    .from("professionals")
    .select("*")
    .eq("id", id)
    .maybeSingle();

    if(error){
        throw error;
    }

    if(!data){
        throw new NotFoundError("Profissional não encontrado.");
    }

    return Professional.restore(
        data.id,
        data.name,
        data.specialty,
        data.active,
        data.phone,
    );
}

async function create(professional: Professional){
    const{data, error} =  await supabase
    .from("professionals")
    .insert({
        name: professional.getName(),
        specialty: professional.getSpecialty(),
        phone: professional.getPhone(),
        active: professional.isActive(),
    })
    .select()
    .single();

    if(error){
        throw error;
    }
    return data;
}

async function update(professional: Professional){
    const id = professional.getId();

    if(!id){
        throw new Error("Profissional sem ID não pode ser atualizado.");
    }

    const{data, error} =  await supabase
    .from("professionals")
    .update({
        name: professional.getName(),
        specialty: professional.getSpecialty(),
        phone: professional.getPhone(),
        active: professional.isActive(),
    })
    .eq("id", id)
    .select()
    .single();

    if(error){
        throw error;
    }

    if(!data){
        throw new NotFoundError("Profissional não encontrado.");
    }

    return data;
}

async function remove(id: string){
    const{data, error} =  await supabase
    .from("professionals")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

    if(error){
        throw error;
    }

    if(!data){
        throw new NotFoundError("Profissional não encontrado.");
    }

    return data;
}

export default{
    findAll,
    findById,
    create,
    update,
    remove,
};