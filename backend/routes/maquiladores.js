const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const maquiladoresController = require('../controllers/maquiladoresController');
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

const createMaquiladorValidation = [
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
      .matches(/^[a-zA-Z0-9\s]+$/)
      .withMessage('Dirección no debe contener caracteres')
      .notEmpty()
      .withMessage('Dirección es requerida'),
    check('capacidad')
      .isInt({ min: 1 })
      .withMessage('Capacidad debe ser un entero positivo'),
    check('estado_id')
      .isInt()
      .withMessage('Estado_id debe ser un entero')
  ];

const updateMaquiladorStatusValidation = [
    check('estado_id')
      .isInt()
      .withMessage('Estado_id debe ser un entero')
  ];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Validation errors',
      data: errors.array(),
      metadata: {}
    });
  }
  next();
};

/**
 * @swagger
 * tags:
 *   name: Maquiladores
 *   description: Gestión de maquiladores
 */

/**
 * @swagger
 * /maquiladores:
 *   get:
 *     summary: Obtener todos los maquiladores
 *     tags: [Maquiladores]
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
 *         description: Estado del maquilador (activo, inactivo, todos)
 *     responses:
 *       200:
 *         description: Lista de maquiladores
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
 *                     $ref: '#/components/schemas/Maquilador'
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
 *                   message: "Maquiladores obtenidos con éxito",
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
router.get('/', authenticateToken, paginationValidation, validate, maquiladoresController.getAllMaquiladores);

/**
 * @swagger
 * /maquiladores/{id}:
 *   get:
 *     summary: Obtener un maquilador por ID
 *     tags: [Maquiladores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del maquilador
 *     responses:
 *       200:
 *         description: Datos del maquilador
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
 *                   $ref: '#/components/schemas/Maquilador'
 *                 metadata:
 *                   type: object
 *                   properties: {}
 *       404:
 *         description: Maquilador no encontrado
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
router.get('/:id', authenticateToken, maquiladoresController.getMaquiladorById);

/**
 * @swagger
 * /maquiladores:
 *   post:
 *     summary: Crear un nuevo maquilador
 *     tags: [Maquiladores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: 'Nombre del Maquilador'
 *               direccion:
 *                 type: string
 *                 example: 'Dirección del Maquilador'
 *               capacidad:
 *                 type: integer
 *                 example: 1000
 *               estado_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Maquilador creado
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
 *                   $ref: '#/components/schemas/Maquilador'
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
router.post('/', authenticateToken, createMaquiladorValidation, validate, maquiladoresController.createMaquilador);

/**
 * @swagger
 * /maquiladores/{id}:
 *   put:
 *     summary: Actualizar un maquilador
 *     tags: [Maquiladores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del maquilador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Maquilador'
 *     responses:
 *       200:
 *         description: Maquilador actualizado
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
 *                   $ref: '#/components/schemas/Maquilador'
 *                 metadata:
 *                   type: object
 *                   properties: {}
 *       404:
 *         description: Maquilador no encontrado
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
router.put('/:id', authenticateToken, createMaquiladorValidation, validate, maquiladoresController.updateMaquilador);

/**
 * @swagger
 * /maquiladores/{id}:
 *   delete:
 *     summary: Baja lógica de un maquilador
 *     tags: [Maquiladores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del maquilador
 *     responses:
 *       200:
 *         description: Maquilador eliminado lógicamente con éxito
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
 *                   $ref: '#/components/schemas/Maquilador'
 *                 metadata:
 *                   type: object
 *                   properties: {}
 *       404:
 *         description: Maquilador no encontrado
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
router.delete('/:id', authenticateToken, maquiladoresController.deleteMaquilador);

/**
 * @swagger
 * /maquiladores/{id}/status:
 *   patch:
 *     summary: Cambiar el estado de un maquilador
 *     tags: [Maquiladores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del maquilador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID del nuevo estado
 *     responses:
 *       200:
 *         description: Estado del maquilador actualizado con éxito
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
 *                   $ref: '#/components/schemas/Maquilador'
 *                 metadata:
 *                   type: object
 *                   properties: {}
 *       404:
 *         description: Maquilador no encontrado
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
  updateMaquiladorStatusValidation,
  validate,
  maquiladoresController.updateMaquiladorStatus
);

module.exports = router;
