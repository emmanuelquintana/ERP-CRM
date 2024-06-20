const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// Verificar si el estado es válido
const checkValidEstado = async (estado_id) => {
  const result = await pool.query('SELECT * FROM estado_maquilador WHERE id = $1', [estado_id]);
  return result.rows.length > 0;
};

// Obtener todos los maquiladores con paginación y filtros
exports.getAllMaquiladores = async (req, res) => {
  const { page = 1, size = 10, estado = 'todos' } = req.query;
  const offset = (page - 1) * size;

  let query = 'SELECT * FROM maquiladores';
  let countQuery = 'SELECT COUNT(*) FROM maquiladores';
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
    console.log('info', `Request to get all maquiladores - Page: ${page}, Size: ${size}, Estado: ${estado}`);
    const result = await pool.query(query, queryParams);
    const total = await pool.query(countQuery, countQueryParams);
    
    let message = 'Maquiladores obtenidos con éxito';
    if (result.rows.length === 0) {
      message = 'No se encontraron maquiladores';
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
    console.log('error', `Error getting maquiladores - ${err.message}`);
    res.status(500).json({
      statusCode: 500,
      message: 'Error obteniendo maquiladores',
      data: {},
      metadata: {}
    });
  }
};

// Obtener un maquilador por ID
exports.getMaquiladorById = async (req, res) => {
  const { id } = req.params;
  try {
    console.log('info', `Request to get maquilador by ID - ID: ${id}`);
    const result = await pool.query('SELECT * FROM maquiladores WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      console.log('warn', `Maquilador not found - ID: ${id}`);
      return res.status(404).json({
        statusCode: 404,
        message: 'Maquilador no encontrado',
        data: {},
        metadata: {}
      });
    }
    res.json({
      statusCode: 200,
      message: 'Maquilador obtenido con éxito',
      data: result.rows[0],
      metadata: {}
    });
  } catch (err) {
    console.log('error', `Error getting maquilador by ID - ${err.message}`);
    res.status(500).json({
      statusCode: 500,
      message: 'Error obteniendo maquilador',
      data: {},
      metadata: {}
    });
  }
};

// Crear un nuevo maquilador
exports.createMaquilador = async (req, res) => {
  const { nombre, direccion, capacidad, estado_id } = req.body;
  const id = uuidv4(); // Generar UUID para el nuevo maquilador

  try {
    console.log('info', `Request to create maquilador - Name: ${nombre}`);

    const estadoValido = await checkValidEstado(estado_id);
    if (!estadoValido) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Estado no válido',
        data: {},
        metadata: {}
      });
    }

    const duplicateCheck = await pool.query('SELECT * FROM maquiladores WHERE nombre = $1', [nombre]);
    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Maquilador con este nombre ya existe',
        data: {},
        metadata: {}
      });
    }

    const result = await pool.query(
      'INSERT INTO maquiladores (id, nombre, direccion, capacidad, estado_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, nombre, direccion, capacidad, estado_id]
    );

    res.json({
      statusCode: 200,
      message: 'Maquilador creado con éxito',
      data: result.rows[0],
      metadata: {}
    });
  } catch (err) {
    console.log('error', `Error creating maquilador - ${err.message}`);
    res.status(500).json({
      statusCode: 500,
      message: 'Error creando maquilador',
      data: {},
      metadata: {}
    });
  }
};

// Actualizar un maquilador
exports.updateMaquilador = async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, capacidad, estado_id } = req.body;
  try {
    console.log('info', `Request to update maquilador - ID: ${id}`);
    const maquiladorResult = await pool.query('SELECT * FROM maquiladores WHERE id = $1', [id]);
    if (maquiladorResult.rows.length === 0) {
      console.log('warn', `Maquilador not found for update - ID: ${id}`);
      return res.status(404).json({
        statusCode: 404,
        message: 'Maquilador no encontrado',
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
      'UPDATE maquiladores SET nombre = $1, direccion = $2, capacidad = $3, estado_id = $4 WHERE id = $5 RETURNING *',
      [nombre, direccion, capacidad, estado_id, id]
    );
    res.json({
      statusCode: 200,
      message: 'Maquilador actualizado con éxito',
      data: result.rows[0],
      metadata: {}
    });
  } catch (err) {
    console.log('error', `Error updating maquilador - ${err.message}`);
    res.status(500).json({
      statusCode: 500,
      message: 'Error actualizando maquilador',
      data: {},
      metadata: {}
    });
  }
};

// Baja lógica de un maquilador
exports.deleteMaquilador = async (req, res) => {
  const { id } = req.params;
  try {
    console.log('info', `Request to logically delete maquilador - ID: ${id}`);
    const maquiladorResult = await pool.query('SELECT * FROM maquiladores WHERE id = $1', [id]);
    if (maquiladorResult.rows.length === 0) {
      console.log('warn', `Maquilador not found for logical delete - ID: ${id}`);
      return res.status(404).json({
        statusCode: 404,
        message: 'Maquilador no encontrado',
        data: {},
        metadata: {}
      });
    }

    if (maquiladorResult.rows[0].estado_id === 2) {
      return res.status(400).json({
        statusCode: 400,
        message: 'El maquilador ya está inactivo',
        data: {},
        metadata: {}
      });
    }

    const result = await pool.query(
      'UPDATE maquiladores SET estado_id = $1 WHERE id = $2 RETURNING *',
      [2, id] 
    );
    res.json({
      statusCode: 200,
      message: 'Maquilador eliminado lógicamente con éxito',
      data: result.rows[0],
      metadata: {}
    });
  } catch (err) {
    console.log('error', `Error logically deleting maquilador - ${err.message}`);
    res.status(500).json({
      statusCode: 500,
      message: 'Error eliminando maquilador',
      data: {},
      metadata: {}
    });
  }
};

// Cambiar el estado de un maquilador (PATCH)
exports.updateMaquiladorStatus = async (req, res) => {
  const { id } = req.params;
  const { estado_id } = req.body;
  try {
    console.log('info', `Request to update status of maquilador - ID: ${id}`);
    const maquiladorResult = await pool.query('SELECT * FROM maquiladores WHERE id = $1', [id]);
    if (maquiladorResult.rows.length === 0) {
      console.log('warn', `Maquilador not found for status update - ID: ${id}`);
      return res.status(404).json({
        statusCode: 404,
        message: 'Maquilador no encontrado',
        data: {},
        metadata: {}
      });
    }

    if (maquiladorResult.rows[0].estado_id === estado_id) {
      return res.status(400).json({
        statusCode: 400,
        message: 'El maquilador ya se encuentra en ese estado',
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
      'UPDATE maquiladores SET estado_id = $1 WHERE id = $2 RETURNING *',
      [estado_id, id]
    );
    res.json({
      statusCode: 200,
      message: 'Estado del maquilador actualizado con éxito',
      data: result.rows[0],
      metadata: {}
    });
  } catch (err) {
    console.log('error', `Error updating status of maquilador - ${err.message}`);
    res.status(500).json({
      statusCode: 500,
      message: 'Error actualizando estado del maquilador',
      data: {},
      metadata: {}
    });
  }
};
