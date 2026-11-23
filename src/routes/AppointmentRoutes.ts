import { Router } from "express";
import AppointmentController from "../controllers/AppointmentController.js";
const router = Router();

/**
 * @openapi
 * /appointments:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Listar todos os agendamentos
 *     description: Retorna todos os agendamentos cadastrados.
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Erro interno ao buscar agendamentos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", AppointmentController.getAll);

/**
 * @openapi
 * /appointments/{id}:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Buscar agendamento por ID
 *     description: Retorna um agendamento específico pelo seu identificador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento.
 *     responses:
 *       200:
 *         description: Agendamento encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Agendamento não encontrado.
 *       500:
 *         description: Erro interno ao buscar agendamento.
 */
router.get("/:id", AppointmentController.getById);

/**
 * @openapi
 * /appointments:
 *   post:
 *     tags:
 *       - Appointments
 *     summary: Criar um agendamento
 *     description: Cadastra um novo agendamento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppointment'
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos.
 *       409:
 *         description: O profissional já possui agendamento nesta data e horário.
 *       500:
 *         description: Erro interno ao criar agendamento.
 */
router.post("/", AppointmentController.create);

/**
 * @openapi
 * /appointments/{id}:
 *   put:
 *     tags:
 *       - Appointments
 *     summary: Atualizar um agendamento
 *     description: Atualiza os dados de um agendamento existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAppointment'
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Agendamento não encontrado.
 *       409:
 *         description: O profissional já possui agendamento nesta data e horário.
 *       500:
 *         description: Erro interno ao atualizar agendamento.
 */
router.put("/:id", AppointmentController.update);

/**
 * @openapi
 * /appointments/{id}:
 *   delete:
 *     tags:
 *       - Appointments
 *     summary: Remover um agendamento
 *     description: Remove um agendamento pelo seu identificador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento.
 *     responses:
 *       200:
 *         description: Agendamento removido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Agendamento não encontrado.
 *       500:
 *         description: Erro interno ao remover agendamento.
 */
router.delete("/:id", AppointmentController.remove);

export default router;