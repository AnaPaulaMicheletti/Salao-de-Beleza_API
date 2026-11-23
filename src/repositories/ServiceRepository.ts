import supabase from "../config/supabase.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { Service } from "../models/Service.js";

async function findAll(){
    const{data, error} =  await supabase
    .from("services")
    .select("*, categories(name)")
    .order("name");

    if(error){
        throw error;
    }
    return data;
}

async function findById(id: string): Promise<Service> {
    const{data, error} =  await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .maybeSingle();

    if(error){
        throw error;
    }

    if(!data){
        throw new NotFoundError("Serviço não encontrado.");
    }

    return Service.restore(
        data.id,
        data.category_id,
        data.name,
        data.price,
        data.duration_minutes,
        data.active,
        data.description,
    );
}

async function create(service: Service){
    const{data, error} =  await supabase
    .from("services")
    .insert({
        category_id: service.getCategoryId(),
        name: service.getName(),
        description: service.getDescription(),
        price: service.getPrice(),
        duration_minutes: service.getDurationMinutes(),
        active: service.isActive(),
    })
    .select()
    .single();

    if(error){
        throw error;
    }
    return data;
}

async function update(service: Service){
    const id = service.getId();

    if(!id){
        throw new Error("Serviço sem ID não pode ser atualizado.");
    }

    const{data, error} =  await supabase
    .from("services")
    .update({
        category_id: service.getCategoryId(),
        name: service.getName(),
        description: service.getDescription(),
        price: service.getPrice(),
        duration_minutes: service.getDurationMinutes(),
        active: service.isActive(),
    })
    .eq("id", id)
    .select()
    .single();

    if(error){
        throw error;
    }

    if(!data){
        throw new NotFoundError("Serviço não encontrado.");
    }

    return data;
}

async function remove(id: string){
    const{data, error} =  await supabase
    .from("services")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

    if(error){
        throw error;
    }

    if(!data){
        throw new NotFoundError("Serviço não encontrado.");
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