const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const pool = require('../config/db');

const checkValidEstado = async (estado_id) => {
  const result = await pool.query('SELECT * FROM estado_usuario WHERE id = $1', [estado_id]);
  return result.rows.length > 0;
};

// Obtener todos los usuarios con paginación
exports.getAllUsuarios = async (req, res) => {
  const { page = 1, size = 10, estado = 'todos' } = req.query;
  const offset = (page - 1) * size;

  let query = 'SELECT * FROM usuarios';
  let countQuery = 'SELECT COUNT(*) FROM usuarios';
  let queryParams = [size, offset];
  let countQueryParams = [];

  if (estado !== 'todos') {
    query += ' WHERE estado_id = $3';
    countQuery += ' WHERE estado_id = $1';
    const estadoId = estado === 'activo' ? 1 : 2;
    queryParams.push(estadoId);
    countQueryParams.push(estadoId);
  }

  query += ' LIMIT $1 OFFSET $2';

  try {
    console.log('info', `Request to get all usuarios - Page: ${page}, Size: ${size}, Estado: ${estado}`);
    const result = await pool.query(query, queryParams);
    const total = await pool.query(countQuery, countQueryParams);

    let message = 'Usuarios obtenidos con éxito';
    if (result.rows.length === 0) {
      message = 'No se encontraron usuarios';
    }

    res.json({
      statusCode: 200,
      message: message,
      data: result.rows,
      metadata: {
        page: parseInt(page),
        size: parseInt(size),
        total: parseInt(total.rows[0].count),
      }
    });
  } catch (err) {
    console.log('error', `Error getting usuarios - ${err.message}`);
    res.status(500).json({
      statusCode: 500,
      message: 'Error obteniendo usuarios',
      data: {},
      metadata: {}
    });
  }
};

// Obtener un usuario por ID
exports.getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    console.log('info', `Request to get usuario by ID - ID: ${id}`);
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      console.log('warn', `Usuario not found - ID: ${id}`);
      return res.status(404).json({
        statusCode: 404,
        message: 'Usuario no encontrado',
        data: {},
        metadata: {}
      });
    }
    res.json({
      statusCode: 200,
      message: 'Usuario obtenido con éxito',
      data: result.rows[0],
      metadata: {}
    });
  } catch (err) {
    console.log('error', `Error getting usuario by ID - ${err.message}`);
    res.status(500).json({
      statusCode: 500,
      message: 'Error obteniendo usuario',
      data: {},
      metadata: {}
    });
  }
};

// Crear un nuevo usuario
exports.createUsuario = async (req, res) => {
  const { nombre, email, password, role, estado_id } = req.body;
  const id = uuidv4(); // Generar UUID para el nuevo usuario

  try {
    console.log('info', `Request to create usuario - Name: ${nombre}`);

    const estadoValido = await checkValidEstado(estado_id);
    if (!estadoValido) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Estado no válido',
        data: {},
        metadata: {}
      });
    }

    const duplicateCheck = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Usuario con este email ya existe',
        data: {},
        metadata: {}
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (id, nombre, email, password, role, estado_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, nombre, email, hashedPassword, role, estado_id]
    );

    res.json({
      statusCode: 200,
      message: 'Usuario creado con éxito',
      data: result.rows[0],
      metadata: {}
    });
  } catch (err) {
    console.log('error', `Error creating usuario - ${err.message}`);
    res.status(500).json({
      statusCode: 500,
      message: 'Error creando usuario',
      data: {},
      metadata: {}
    });
  }
};

// Actualizar un usuario
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, role, estado_id } = req.body;
  try {
    console.log('info', `Request to update usuario - ID: ${id}`);
    const usuarioResult = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (usuarioResult.rows.length === 0) {
      console.log('warn', `Usuario not found for update - ID: ${id}`);
      return res.status(404).json({
        statusCode: 404,
        message: 'Usuario no encontrado',
        data: {},
        metadata: {}
      });
    }

    const estadoValido = await checkValidEstado(estado_id);
    if (!estadoValido) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Estado no válido',
        data: {},
        metadata: {}
      });
    }

    const result = await pool.query(
      'UPDATE usuarios SET nombre = $1, email = $2, role = $3, estado_id = $4 WHERE id = $5 RETURNING *',
      [nombre, email, role, estado_id, id]
    );
    res.json({
      statusCode: 200,
      message: 'Usuario actualizado con éxito',
      data: result.rows[0],
      metadata: {}
    });
  } catch (err) {
    console.log('error', `Error updating usuario - ${err.message}`);
    res.status(500).json({
      statusCode: 500,
      message: 'Error actualizando usuario',
      data: {},
      metadata: {}
    });
  }
};

// Baja lógica de un usuario
exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    console.log('info', `Request to logically delete usuario - ID: ${id}`);
    const usuarioResult = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (usuarioResult.rows.length === 0) {
      console.log('warn', `Usuario not found for logical delete - ID: ${id}`);
      return res.status(404).json({
        statusCode: 404,
        message: 'Usuario no encontrado',
        data: {},
        metadata: {}
      });
    }

    if (usuarioResult.rows[0].estado_id === 2) {
      return res.status(400).json({
        statusCode: 400,
        message: 'El usuario ya está inactivo',
        data: {},
        metadata: {}
      });
    }

    const result = await pool.query(
      'UPDATE usuarios SET estado_id = $1 WHERE id = $2 RETURNING *',
      [2, id]
    );
    res.json({
      statusCode: 200,
      message: 'Usuario eliminado lógicamente con éxito',
      data: result.rows[0],
      metadata: {}
    });
  } catch (err) {
    console.log('error', `Error logically deleting usuario - ${err.message}`);
    res.status(500).json({
      statusCode: 500,
      message: 'Error eliminando usuario',
      data: {},
      metadata: {}
    });
  }
};

// Cambiar el estado de un usuario (PATCH)
exports.updateUsuarioStatus = async (req, res) => {
  const { id } = req.params;
  const { estado_id } = req.body;
  try {
    console.log('info', `Request to update status of usuario - ID: ${id}`);
    const usuarioResult = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (usuarioResult.rows.length === 0) {
      console.log('warn', `Usuario not found for status update - ID: ${id}`);
      return res.status(404).json({
        statusCode: 404,
        message: 'Usuario no encontrado',
        data: {},
        metadata: {}
      });
    }

    if (usuarioResult.rows[0].estado_id === estado_id) {
      return res.status(400).json({
        statusCode: 400,
        message: 'El usuario ya se encuentra en ese estado',
        data: {},
        metadata: {}
      });
    }

    const estadoValido = await checkValidEstado(estado_id);
    if (!estadoValido) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Estado no válido',
        data: {},
        metadata: {}
      });
    }

    const result = await pool.query(
      'UPDATE usuarios SET estado_id = $1 WHERE id = $2 RETURNING *',
      [estado_id, id]
    );
    res.json({
      statusCode: 200,
      message: 'Estado del usuario actualizado con éxito',
      data: result.rows[0],
      metadata: {}
    });
  } catch (err) {
    console.log('error', `Error updating status of usuario - ${err.message}`);
    res.status(500).json({
      statusCode: 500,
      message: 'Error actualizando estado del usuario',
      data: {},
      metadata: {}
    });
  }
};
