import { ValidationError } from "../errors/ValidationError.js";

export class Professional{
    private id?: string | undefined;
    private name: string;
    private specialty: string;
    private phone: string | undefined;
    private active: boolean;

    constructor(
        name: string,
        specialty: string,
        phone?: string
    ){
        this.id = undefined;
        this.name = "";
        this.specialty = "";
        this.phone = phone;
        this.active = true;

        this.rename(name);
        this.changeSpecialty(specialty);
    }

    static restore(
        id: string,
        name: string,
        specialty: string,
        active: boolean,
        phone?: string,
    ): Professional{
        const professional = new Professional(name, specialty, phone);

        professional.id = id;
        professional.active = active;

        return professional;
    }

    public getId(): string | undefined{
        return this.id;
    }

    public getName(): string{
        return this.name;
    }

    public getSpecialty(): string{
        return this.specialty;
    }

    public getPhone(): string | undefined{
        return this.phone;
    }

    public isActive(): boolean{
        return this.active;
    }

    //para renomear name
    rename(name: string): void{
        if(typeof name !== "string" || name.trim().length === 0){
            throw new ValidationError ("O nome do profissional é obrigatório.");
        }

        this.name = name.trim();
    }

    //para trocar a especialidade e o telefone
    changeSpecialty(specialty: string): void{
        if(typeof specialty !== "string" || specialty.trim().length === 0){
            throw new ValidationError ("A especialidade do profissional é obrigatória.");
        }

        this.specialty = specialty.trim();
    }

    changePhone(phone: string): void{
        this.phone = phone;
    }

    activate(): void{
        this.active = true;
    }

    deactivate(): void{
        this.active = false;
    }
}