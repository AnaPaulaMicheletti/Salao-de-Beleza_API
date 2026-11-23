import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import supabase from "../config/supabase.js";

describe("Service - Teste de integração", () => {
    const testNames: string[] = [];
    const categoryNames: string[] = [];

    async function createCategory(){
        const name = `Teste integração ${randomUUID()}`;

        categoryNames.push(name);

        const response = await request(app).post("/categories").send({
            name,
            description: "Categoria criada pelo teste de integração",
        });

        expect(response.status).toBe(201);

        return response.body.id as string;
    }

    function makeServiceData(category_id: string){
        const name = `Teste integração ${randomUUID()}`;

        testNames.push(name);

        return {
            category_id,
            name,
            description: "Serviço criado pelo teste de integração",
            price: 80,
            duration_minutes: 60,
        };
    }

    async function createService(){
        const category_id = await createCategory();
        const data = makeServiceData(category_id);

        const response = await request(app).post("/services").send(data);

        expect(response.status).toBe(201);
        expect(response.body.id).toEqual(expect.any(String));

        return{
            id: response.body.id as string,
            data,
        };
    }

    afterEach(async () => {
        const names = testNames.slice(0);
        const categories = categoryNames.slice(0);

        if(names.length > 0){
            const {error} = await supabase
            .from("services")
            .delete()
            .in("name", names);

            if(error){
                throw new Error(`Falha ao limpar serviços do teste: ${error.message}`);
            }
        }

        if(categories.length > 0){
            const {error} = await supabase
            .from("categories")
            .delete()
            .in("name", categories);

            if(error){
                throw new Error(`Falha ao limpar categorias do teste: ${error.message}`);
            }
        }
    }, 20_000);

    it("deve criar um serviço válido", async () => {
        const category_id = await createCategory();
        const data = makeServiceData(category_id);

        const response = await request(app).post("/services").send(data);

        expect(response.status).toBe(201);
        expect(response.body.id).toEqual(expect.any(String));
        expect(response.body).toMatchObject({
            ...data,
            active: true,
        });
    }, 20_000);

    it("deve listar os serviços inclusive o serviço criado", async () => {
        const { id, data } = await createService();

        const response = await request(app).get("/services");

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

    it("deve consultar um serviço existente pelo ID", async () => {
        const {id, data} = await createService();

        const response = await request(app).get(`/services/${id}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id,
            ...data,
            active: true,
        });
    }, 20_000);

    it("deve remover um serviço existente", async () => {
        const {id} = await createService();

        const response = await request(app).delete(`/services/${id}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({message: "Serviço removido com sucesso."});
    }, 20_000);

    it("deve atualizar um serviço existente", async () => {
        const {id, data} = await createService();

        const updateData = {
            ...makeServiceData(data.category_id),
            description: "Descrição atualizada pelo teste.",
            price: 120,
            duration_minutes: 90,
            active: false,
        };

        const response = await request(app)
        .put(`/services/${id}`)
        .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id,
            ...updateData,
        });
    }, 20_000);
});