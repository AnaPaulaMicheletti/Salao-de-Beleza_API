import { Router } from "express";
import ServiceController from "../controllers/ServiceController.js";
const router = Router();

/**
 * @openapi
 * /services:
 *   get:
 *     tags:
 *       - Services
 *     summary: Listar todos os serviços
 *     description: Retorna todos os serviços cadastrados.
 *     responses:
 *       200:
 *         description: Lista de serviços retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Erro interno ao buscar serviços.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", ServiceController.getAll);

/**
 * @openapi
 * /services/{id}:
 *   get:
 *     tags:
 *       - Services
 *     summary: Buscar serviço por ID
 *     description: Retorna um serviço específico pelo seu identificador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do serviço.
 *     responses:
 *       200:
 *         description: Serviço encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Serviço não encontrado.
 *       500:
 *         description: Erro interno ao buscar serviço.
 */
router.get("/:id", ServiceController.getById);

/**
 * @openapi
 * /services:
 *   post:
 *     tags:
 *       - Services
 *     summary: Criar um serviço
 *     description: Cadastra um novo serviço.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateService'
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno ao criar serviço.
 */
router.post("/", ServiceController.create);

/**
 * @openapi
 * /services/{id}:
 *   put:
 *     tags:
 *       - Services
 *     summary: Atualizar um serviço
 *     description: Atualiza os dados de um serviço existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do serviço.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateService'
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Serviço não encontrado.
 *       500:
 *         description: Erro interno ao atualizar serviço.
 */
router.put("/:id", ServiceController.update);

/**
 * @openapi
 * /services/{id}:
 *   delete:
 *     tags:
 *       - Services
 *     summary: Remover um serviço
 *     description: Remove um serviço pelo seu identificador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do serviço.
 *     responses:
 *       200:
 *         description: Serviço removido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Serviço não encontrado.
 *       500:
 *         description: Erro interno ao remover serviço.
 */
router.delete("/:id", ServiceController.remove);

export default router;