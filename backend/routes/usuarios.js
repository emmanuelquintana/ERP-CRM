const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
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

const createUsuarioValidation = [
    check('nombre')
      .isLength({ max: 50 })
      .withMessage('Nombre debe tener como máximo 50 caracteres')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Nombre no debe contener números')
      .notEmpty()
      .withMessage('Nombre es requerido'),
    check('email')
      .isEmail()
      .withMessage('Debe ser un email válido')
      .notEmpty()
      .withMessage('Email es requerido'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password debe tener como mínimo 6 caracteres')
      .notEmpty()
      .withMessage('Password es requerido'),
    check('role')
      .isLength({ max: 50 })
      .withMessage('Role debe tener como máximo 50 caracteres')
      .notEmpty()
      .withMessage('Role es requerido'),
    check('estado_id')
      .isInt()
      .withMessage('Estado_id debe ser un entero')
  ];

const updateUsuarioStatusValidation = [
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
 *   name: Usuarios
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
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
 *         description: Estado del usuario (activo, inactivo, todos)
 *     responses:
 *       200:
 *         description: Lista de usuarios
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
 *                     $ref: '#/components/schemas/Usuario'
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
 *                   message: "Usuarios obtenidos con éxito",
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
router.get('/', authenticateToken, paginationValidation, validate, usuariosController.getAllUsuarios);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Datos del usuario
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
 *                   $ref: '#/components/schemas/Usuario'
 *                 metadata:
 *                   type: object
 *                   properties: {}
 *       404:
 *         description: Usuario no encontrado
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
router.get('/:id', authenticateToken, usuariosController.getUsuarioById);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: 'Nombre del Usuario'
 *               email:
 *                 type: string
 *                 example: 'usuario@example.com'
 *               password:
 *                 type: string
 *                 example: 'password123'
 *               role:
 *                 type: string
 *                 example: 'admin'
 *               estado_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Usuario creado
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
 *                   $ref: '#/components/schemas/Usuario'
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
router.post('/', authenticateToken, createUsuarioValidation, validate, usuariosController.createUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado
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
 *                   $ref: '#/components/schemas/Usuario'
 *                 metadata:
 *                   type: object
 *                   properties: {}
 *       404:
 *         description: Usuario no encontrado
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
router.put('/:id', authenticateToken, createUsuarioValidation, validate, usuariosController.updateUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Baja lógica de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado lógicamente con éxito
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
 *                   $ref: '#/components/schemas/Usuario'
 *                 metadata:
 *                   type: object
 *                   properties: {}
 *       404:
 *         description: Usuario no encontrado
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
router.delete('/:id', authenticateToken, usuariosController.deleteUsuario);

/**
 * @swagger
 * /usuarios/{id}/status:
 *   patch:
 *     summary: Cambiar el estado de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
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
 *         description: Estado del usuario actualizado con éxito
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
 *                   $ref: '#/components/schemas/Usuario'
 *                 metadata:
 *                   type: object
 *                   properties: {}
 *       404:
 *         description: Usuario no encontrado
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
  updateUsuarioStatusValidation,
  validate,
  usuariosController.updateUsuarioStatus
);

module.exports = router;
