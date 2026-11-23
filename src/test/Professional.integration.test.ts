import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import supabase from "../config/supabase.js";

describe("Professional - Teste de integração", () => {
    const testNames: string[] = [];

    function makeProfessionalData(){
        const name = `Teste integração ${randomUUID()}`;

        testNames.push(name);

        return {
            name,
            specialty: "Cabeleireira",
            phone: "41999999999",
        };
    }

    async function createProfessional(){
        const data = makeProfessionalData();

        const response = await request(app).post("/professionals").send(data);

        expect(response.status).toBe(201);
        expect(response.body.id).toEqual(expect.any(String));

        return{
            id: response.body.id as string,
            data,
        };
    }

    afterEach(async () => {
        const names = testNames.slice(0);

        if(names.length === 0){
            return;
        }

        const {error} = await supabase
        .from("professionals")
        .delete()
        .in("name", names);

        if(error){
            throw new Error(`Falha ao limpar profissionais do teste: ${error.message}`);
        }
    }, 20_000);

    it("deve criar um profissional válido", async () => {
        const data = makeProfessionalData();

        const response = await request(app).post("/professionals").send(data);

        expect(response.status).toBe(201);
        expect(response.body.id).toEqual(expect.any(String));
        expect(response.body).toMatchObject({
            ...data,
            active: true,
        });
    }, 20_000);

    it("deve listar os profissionais inclusive o profissional criado", async () => {
        const { id, data } = await createProfessional();

        const response = await request(app).get("/professionals");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id,
                    name: data.name,
                }),
            ]),
        );
    }, 20_000);

    it("deve consultar um profissional existente pelo ID", async () => {
        const {id, data} = await createProfessional();

        const response = await request(app).get(`/professionals/${id}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id,
            ...data,
            active: true,
        });
    }, 20_000);

    it("deve remover um profissional existente", async () => {
        const {id} = await createProfessional();

        const response = await request(app).delete(`/professionals/${id}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({message: "Profissional removido com sucesso."});
    }, 20_000);

    it("deve atualizar um profissional existente", async () => {
        const {id} = await createProfessional();

        const updateData = {
            ...makeProfessionalData(),
            specialty: "Manicure",
            phone: "41888888888",
            active: false,
        };

        const response = await request(app)
        .put(`/professionals/${id}`)
        .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id,
            ...updateData,
        });
    }, 20_000);
});