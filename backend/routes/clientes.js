const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const { authenticateToken } = require('../middleware/auth');

const paginationValidation = [
  check('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .custom(value => [1, 10, 100, 1000].includes(Number(value)))
    .withMessage('Page must be one of 1, 10, 100, 1000'),
  check('size')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Size must be a positive integer')
    .custom(value => [1, 10, 100, 1000].includes(Number(value)))
    .withMessage('Size must be one of 1, 10, 100, 1000'),
  check('estado')
    .optional()
    .isIn(['activo', 'inactivo', 'todos'])
    .withMessage('Estado must be one of activo, inactivo, todos')
];

const createClienteValidation = [
  check('nombre')
    .isLength({ max: 50 })
    .withMessage('Nombre debe tener como máximo 50 caracteres')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Nombre no debe contener números')
    .notEmpty()
    .withMessage('Nombre es requerido'),
  check('direccion')
    .isLength({ max: 100 })
    .withMessage('Dirección debe tener como máximo 100 caracteres')
    .notEmpty()
    .withMessage('Dirección es requerida'),
  check('contacto')
    .isLength({ max: 50 })
    .withMessage('Contacto debe tener como máximo 50 caracteres')
    .notEmpty()
    .withMessage('Contacto es requerido'),
  check('telefono')
    .isLength({ min: 10, max: 10 })
    .withMessage('Teléfono debe tener 10 caracteres')
    .matches(/^[0-9]+$/)
    .withMessage('Teléfono debe contener solo números')
    .notEmpty()
    .withMessage('Teléfono es requerido'),
  check('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .notEmpty()
    .withMessage('Email es requerido'),
  check('estado_id')
    .isInt()
    .withMessage('Estado_id debe ser un entero')
];

const updateClienteStatusValidation = [
  check('estado_id')
    .isInt()
    .withMessage('Estado_id debe ser un entero')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Errores de validación',
      data: errors.array(),
      metadata: {}
    });
  }
  next();
};

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gestión de clientes
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Clientes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: Tamaño de la página
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [activo, inactivo, todos]
 *         description: Estado del cliente (activo, inactivo, todos)
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cliente'
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     size:
 *                       type: integer
 *                     total:
 *                       type: integer
 *             examples:
 *               example:
 *                 value: {
 *                   statusCode: 200,
 *                   message: "Clientes obtenidos con éxito",
 *                   data: [],
 *                   metadata: {
 *                     page: 1,
 *                     size: 10,
 *                     total: 0
 *                   }
 *                 }
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', authenticateToken, paginationValidation, validate, clientesController.getAllClientes);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Datos del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *                 metadata:
 *                   type: object
 *                   properties: {}
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 metadata:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', authenticateToken, clientesController.getClienteById);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *                 metadata:
 *                   type: object
 *                   properties: {}
 *       400:
 *         description: Errores de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *                 metadata:
 *                   type: object
 *                   properties: {}
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', authenticateToken, createClienteValidation, validate, clientesController.createCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Actualizar un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *                 metadata:
 *                   type: object
 *                   properties: {}
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 metadata:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id', authenticateToken, createClienteValidation, validate, clientesController.updateCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Baja lógica de un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado lógicamente con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *                 metadata:
 *                   type: object
 *                   properties: {}
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 metadata:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', authenticateToken, clientesController.deleteCliente);

/**
 * @swagger
 * /clientes/{id}/status:
 *   patch:
 *     summary: Cambiar el estado de un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado_id:
 *                 type: integer
 *                 description: ID del nuevo estado
 *     responses:
 *       200:
 *         description: Estado del cliente actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *                 metadata:
 *                   type: object
 *                   properties: {}
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 metadata:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.patch(
  '/:id/status',
  authenticateToken,
  updateClienteStatusValidation,
  validate,
  clientesController.updateClienteStatus
);

module.exports = router;
