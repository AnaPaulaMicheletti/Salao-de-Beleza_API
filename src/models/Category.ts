import { ValidationError } from "../errors/ValidationError.js";

export class Category{
    private id?: string | undefined;
    private name: string;
    private description: string | undefined;
    private active: boolean;

    constructor(
        name: string,
        description?: string
    ){
        this.id = undefined;
        this.name = "";
        this.description = description;
        this.active = true;

        this.rename(name);
    }

    static restore(
        id: string,
        name: string,
        active: boolean,
        description?: string,
    ): Category{
        const category = new Category(name, description);

        category.id = id;
        category.active = active;

        return category;
    }

    public getId(): string | undefined{
        return this.id;
    }

    public getName(): string{
        return this.name;
    }

    public getDescription(): string | undefined{
        return this.description;
    }

    public isActive(): boolean{
        return this.active;
    }

    //para renomear name
    rename(name: string): void{
        if(typeof name !== "string" || name.trim().length === 0){
            throw new ValidationError ("O nome da categoria é obrigatório.");
        }

        this.name = name.trim();
    }

    //para trocar a descrição
    changeDescription(description: string): void{
        this.description = description;
    }

    activate(): void{
        this.active = true;
    }

    deactivate(): void{
        this.active = false;
    }
}