import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import supabase from "../config/supabase.js";

describe("Appointment - Teste de integração", () => {
    const testNames: string[] = [];
    const serviceNames: string[] = [];
    const professionalNames: string[] = [];
    const categoryNames: string[] = [];

    async function createDependencies(){
        const categoryName = `Teste integração ${randomUUID()}`;
        const serviceName = `Teste integração ${randomUUID()}`;
        const professionalName = `Teste integração ${randomUUID()}`;

        categoryNames.push(categoryName);
        serviceNames.push(serviceName);
        professionalNames.push(professionalName);

        const category = await request(app).post("/categories").send({
            name: categoryName,
            description: "Categoria criada pelo teste de integração",
        });

        expect(category.status).toBe(201);

        const service = await request(app).post("/services").send({
            category_id: category.body.id,
            name: serviceName,
            description: "Serviço criado pelo teste de integração",
            price: 80,
            duration_minutes: 60,
        });

        expect(service.status).toBe(201);

        const professional = await request(app).post("/professionals").send({
            name: professionalName,
            specialty: "Cabeleireira",
            phone: "41999999999",
        });

        expect(professional.status).toBe(201);

        return{
            service_id: service.body.id as string,
            professional_id: professional.body.id as string,
        };
    }

    function makeAppointmentData(service_id: string, professional_id: string){
        const client_name = `Teste integração ${randomUUID()}`;

        testNames.push(client_name);

        return {
            service_id,
            professional_id,
            client_name,
            client_phone: "41999999999",
            appointment_date: "2026-12-10",
            appointment_time: "14:30:00",
        };
    }

    async function createAppointment(){
        const {service_id, professional_id} = await createDependencies();
        const data = makeAppointmentData(service_id, professional_id);

        const response = await request(app).post("/appointments").send(data);

        expect(response.status).toBe(201);
        expect(response.body.id).toEqual(expect.any(String));

        return{
            id: response.body.id as string,
            data,
        };
    }

    async function removeByNames(table: string, column: string, names: string[]){
        if(names.length === 0){
            return;
        }

        const {error} = await supabase
        .from(table)
        .delete()
        .in(column, names);

        if(error){
            throw new Error(`Falha ao limpar ${table} do teste: ${error.message}`);
        }
    }

    afterEach(async () => {
        await removeByNames("appointments", "client_name", testNames.slice(0));
        await removeByNames("services", "name", serviceNames.slice(0));
        await removeByNames("professionals", "name", professionalNames.slice(0));
        await removeByNames("categories", "name", categoryNames.slice(0));
    }, 20_000);

    it("deve criar um agendamento válido", async () => {
        const {service_id, professional_id} = await createDependencies();
        const data = makeAppointmentData(service_id, professional_id);

        const response = await request(app).post("/appointments").send(data);

        expect(response.status).toBe(201);
        expect(response.body.id).toEqual(expect.any(String));
        expect(response.body).toMatchObject({
            ...data,
            status: "agendado",
        });
    }, 20_000);

    it("deve listar os agendamentos inclusive o agendamento criado", async () => {
        const { id, data } = await createAppointment();

        const response = await request(app).get("/appointments");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id,
                    client_name: data.client_name,
                }),
            ]),
        );
    }, 20_000);

    it("deve consultar um agendamento existente pelo ID", async () => {
        const {id, data} = await createAppointment();

        const response = await request(app).get(`/appointments/${id}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id,
            ...data,
            status: "agendado",
        });
    }, 20_000);

    it("deve remover um agendamento existente", async () => {
        const {id} = await createAppointment();

        const response = await request(app).delete(`/appointments/${id}`);

        //console.log(response.status, response.headers["content-type"], response.body, response.text);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({message: "Agendamento removido com sucesso."});
    }, 20_000);

    it("deve atualizar um agendamento existente", async () => {
        const {id, data} = await createAppointment();

        const updateData = {
            ...makeAppointmentData(data.service_id, data.professional_id),
            client_phone: "41888888888",
            appointment_date: "2026-12-11",
            appointment_time: "15:30:00",
        };

        const response = await request(app)
        .put(`/appointments/${id}`)
        .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id,
            ...updateData,
        });
    }, 20_000);
});