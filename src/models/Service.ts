import { ValidationError } from "../errors/ValidationError.js";

export class Service{
    private id?: string | undefined;
    private category_id: string;
    private name: string;
    private description: string | undefined;
    private price: number;
    private duration_minutes: number;
    private active: boolean;

    constructor(
        category_id: string,
        name: string,
        price: number,
        duration_minutes: number,
        description?: string
    ){
        this.id = undefined;
        this.category_id = "";
        this.name = "";
        this.description = description;
        this.price = 0;
        this.duration_minutes = 0;
        this.active = true;

        this.changeCategory(category_id);
        this.rename(name);
        this.changePrice(price);
        this.changeDuration(duration_minutes);
    }

    static restore(
        id: string,
        category_id: string,
        name: string,
        price: number,
        duration_minutes: number,
        active: boolean,
        description?: string,
    ): Service{
        const service = new Service(category_id, name, price, duration_minutes, description);

        service.id = id;
        service.active = active;

        return service;
    }

    public getId(): string | undefined{
        return this.id;
    }

    public getCategoryId(): string{
        return this.category_id;
    }

    public getName(): string{
        return this.name;
    }

    public getDescription(): string | undefined{
        return this.description;
    }

    public getPrice(): number{
        return this.price;
    }

    public getDurationMinutes(): number{
        return this.duration_minutes;
    }

    public isActive(): boolean{
        return this.active;
    }

    //para renomear name
    rename(name: string): void{
        if(typeof name !== "string" || name.trim().length === 0){
            throw new ValidationError ("O nome do serviço é obrigatório.");
        }

        this.name = name.trim();
    }

    //para trocar categoria, descrição, preço, duração
    changeCategory(category_id: string): void{
        if(typeof category_id !== "string" || category_id.trim().length === 0){
            throw new ValidationError ("A categoria do serviço é obrigatória.");
        }

        this.category_id = category_id.trim();
    }

    changeDescription(description: string): void{
        this.description = description;
    }

    changePrice(price: number): void{
        if(typeof price !== "number" || Number.isNaN(price) || price < 0){
            throw new ValidationError ("O preço deve ser um número maior ou igual a zero.");
        }

        this.price = price;
    }

    changeDuration(duration_minutes: number): void{
        if(!Number.isInteger(duration_minutes) || duration_minutes <= 0){
            throw new ValidationError ("A duração deve ser um número inteiro maior que zero.");
        }

        this.duration_minutes = duration_minutes;
    }

    activate(): void{
        this.active = true;
    }

    deactivate(): void{
        this.active = false;
    }
}