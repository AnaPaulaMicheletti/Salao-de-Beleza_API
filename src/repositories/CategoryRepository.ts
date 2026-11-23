import supabase from "../config/supabase.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { Category } from "../models/Category.js";

async function findAll(){
    const{data, error} =  await supabase
    .from("categories")
    .select("*")
    .order("name");

    if(error){
        throw error;
    }
    return data;
}

async function findById(id: string): Promise<Category> {
    const{data, error} =  await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

    if(error){
        throw error;
    }

    if(!data){
        throw new NotFoundError("Categoria não encontrada.");
    }

    return Category.restore(
        data.id,
        data.name,
        data.active,
        data.description,
    );
}

async function create(category: Category){
    const{data, error} =  await supabase
    .from("categories")
    .insert({
        name: category.getName(),
        description: category.getDescription(),
        active: category.isActive(),
    })
    .select()
    .single();

    if(error){
        throw error;
    }
    return data;
}

async function update(category: Category){
    const id = category.getId();

    if(!id){
        throw new Error("Categoria sem ID não pode ser atualizada.");
    }

    const{data, error} =  await supabase
    .from("categories")
    .update({
        name: category.getName(),
        description: category.getDescription(),
        active: category.isActive(),
    })
    .eq("id", id)
    .select()
    .single();

    if(error){
        throw error;
    }

    if(!data){
        throw new NotFoundError("Categoria não encontrada.");
    }

    return data;
}

async function remove(id: string){
    const{data, error} =  await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

    if(error){
        throw error;
    }

    if(!data){
        throw new NotFoundError("Categoria não encontrada.");
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