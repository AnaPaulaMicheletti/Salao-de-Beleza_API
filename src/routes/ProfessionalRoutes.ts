import { Router } from "express";
import ProfessionalController from "../controllers/ProfessionalController.js";
const router = Router();

/**
 * @openapi
 * /professionals:
 *   get:
 *     tags:
 *       - Professionals
 *     summary: Listar todos os profissionais
 *     description: Retorna todos os profissionais cadastrados.
 *     responses:
 *       200:
 *         description: Lista de profissionais retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professional'
 *       500:
 *         description: Erro interno ao buscar profissionais.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", ProfessionalController.getAll);

/**
 * @openapi
 * /professionals/{id}:
 *   get:
 *     tags:
 *       - Professionals
 *     summary: Buscar profissional por ID
 *     description: Retorna um profissional específico pelo seu identificador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do profissional.
 *     responses:
 *       200:
 *         description: Profissional encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado.
 *       500:
 *         description: Erro interno ao buscar profissional.
 */
router.get("/:id", ProfessionalController.getById);

/**
 * @openapi
 * /professionals:
 *   post:
 *     tags:
 *       - Professionals
 *     summary: Criar um profissional
 *     description: Cadastra um novo profissional.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProfessional'
 *     responses:
 *       201:
 *         description: Profissional criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno ao criar profissional.
 */
router.post("/", ProfessionalController.create);

/**
 * @openapi
 * /professionals/{id}:
 *   put:
 *     tags:
 *       - Professionals
 *     summary: Atualizar um profissional
 *     description: Atualiza os dados de um profissional existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do profissional.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfessional'
 *     responses:
 *       200:
 *         description: Profissional atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Profissional não encontrado.
 *       500:
 *         description: Erro interno ao atualizar profissional.
 */
router.put("/:id", ProfessionalController.update);

/**
 * @openapi
 * /professionals/{id}:
 *   delete:
 *     tags:
 *       - Professionals
 *     summary: Remover um profissional
 *     description: Remove um profissional pelo seu identificador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do profissional.
 *     responses:
 *       200:
 *         description: Profissional removido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Profissional não encontrado.
 *       500:
 *         description: Erro interno ao remover profissional.
 */
router.delete("/:id", ProfessionalController.remove);

export default router;