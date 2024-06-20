const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

const checkValidEstado = async (estado_id) => {
    const result = await pool.query('SELECT * FROM estado_cliente WHERE id = $1', [estado_id]);
    return result.rows.length > 0;
  };
// Obtener todos los clientes con paginación
exports.getAllClientes = async (req, res) => {
    const { page = 1, size = 10, estado = 'todos' } = req.query;
    const offset = (page - 1) * size;
    let query = 'SELECT * FROM clientes';
    let countQuery = 'SELECT COUNT(*) FROM clientes';
    const params = [];
    const countParams = [];
  
    if (estado === 'activo') {
      query += ' WHERE estado_id = 1';
      countQuery += ' WHERE estado_id = 1';
    } else if (estado === 'inactivo') {
      query += ' WHERE estado_id = 2';
      countQuery += ' WHERE estado_id = 2';
    }
  
    query += ' LIMIT $1 OFFSET $2';
    params.push(size, offset);
  
    try {
      console.log('info', `Request to get all clientes - Page: ${page}, Size: ${size}, Estado: ${estado}`);
      const result = await pool.query(query, params);
      const total = await pool.query(countQuery, countParams);
      
      let message = 'Clientes obtenidos con éxito';
      if (result.rows.length === 0) {
        message = 'No se encontraron clientes';
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
      console.log('error', `Error getting clientes - ${err.message}`);
      res.status(500).json({
        statusCode: 500,
        message: 'Error obteniendo clientes',
        data: {},
        metadata: {}
      });
    }
  };
  

// Obtener un cliente por ID
exports.getClienteById = async (req, res) => {
  const { id } = req.params;
  try {
    console.log('info', `Request to get cliente by ID - ID: ${id}`);
    const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      console.log('warn', `Cliente not found - ID: ${id}`);
      return res.status(404).json({
        statusCode: 404,
        message: 'Cliente no encontrado',
        data: {},
        metadata: {}
      });
    }
    res.json({
      statusCode: 200,
      message: 'Cliente obtenido con éxito',
      data: result.rows[0],
      metadata: {}
    });
  } catch (err) {
    console.log('error', `Error getting cliente by ID - ${err.message}`);
    res.status(500).json({
      statusCode: 500,
      message: 'Error obteniendo cliente',
      data: {},
      metadata: {}
    });
  }
};

// Crear un nuevo cliente
exports.createCliente = async (req, res) => {
    const { nombre, direccion, contacto, telefono, email, estado_id } = req.body;
    const id = uuidv4(); // Generar UUID para el nuevo cliente
  
    try {
      console.log('info', `Request to create cliente - Name: ${nombre}`);
  
      const estadoValido = await checkValidEstado(estado_id);
      if (!estadoValido) {
        return res.status(400).json({
          statusCode: 400,
          message: 'Estado no válido',
          data: {},
          metadata: {}
        });
      }
  
      const duplicateCheck = await pool.query('SELECT * FROM clientes WHERE email = $1', [email]);
      if (duplicateCheck.rows.length > 0) {
        return res.status(400).json({
          statusCode: 400,
          message: 'Cliente con este email ya existe',
          data: {},
          metadata: {}
        });
      }
  
      const result = await pool.query(
        'INSERT INTO clientes (id, nombre, direccion, contacto, telefono, email, estado_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [id, nombre, direccion, contacto, telefono, email, estado_id]
      );
  
      res.json({
        statusCode: 200,
        message: 'Cliente creado con éxito',
        data: result.rows[0],
        metadata: {}
      });
    } catch (err) {
      console.log('error', `Error creating cliente - ${err.message}`);
      res.status(500).json({
        statusCode: 500,
        message: 'Error creando cliente',
        data: {},
        metadata: {}
      });
    }
  };
// Actualizar un cliente
exports.updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, contacto, telefono, email, estado_id } = req.body;
  try {
    console.log('info', `Request to update cliente - ID: ${id}`);
    const clienteResult = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
    if (clienteResult.rows.length === 0) {
      console.log('warn', `Cliente not found for update - ID: ${id}`);
      return res.status(404).json({
        statusCode: 404,
        message: 'Cliente no encontrado',
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
      'UPDATE clientes SET nombre = $1, direccion = $2, contacto = $3, telefono = $4, email = $5, estado_id = $6 WHERE id = $7 RETURNING *',
      [nombre, direccion, contacto, telefono, email, estado_id, id]
    );
    res.json({
      statusCode: 200,
      message: 'Cliente actualizado con éxito',
      data: result.rows[0],
      metadata: {}
    });
  } catch (err) {
    console.log('error', `Error updating cliente - ${err.message}`);
    res.status(500).json({
      statusCode: 500,
      message: 'Error actualizando cliente',
      data: {},
      metadata: {}
    });
  }
};

// Baja lógica de un cliente
exports.deleteCliente = async (req, res) => {
  const { id } = req.params;
  try {
    console.log('info', `Request to logically delete cliente - ID: ${id}`);
    const clienteResult = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
    if (clienteResult.rows.length === 0) {
      console.log('warn', `Cliente not found for logical delete - ID: ${id}`);
      return res.status(404).json({
        statusCode: 404,
        message: 'Cliente no encontrado',
        data: {},
        metadata: {}
      });
    }

    if (clienteResult.rows[0].estado_id === 2) {
      return res.status(400).json({
        statusCode: 400,
        message: 'El cliente ya está inactivo',
        data: {},
        metadata: {}
      });
    }

    const result = await pool.query(
      'UPDATE clientes SET estado_id = $1 WHERE id = $2 RETURNING *',
      [2, id] 
    );
    res.json({
      statusCode: 200,
      message: 'Cliente eliminado lógicamente con éxito',
      data: result.rows[0],
      metadata: {}
    });
  } catch (err) {
    console.log('error', `Error logically deleting cliente - ${err.message}`);
    res.status(500).json({
      statusCode: 500,
      message: 'Error eliminando cliente',
      data: {},
      metadata: {}
    });
  }
};

// Cambiar el estado de un cliente (PATCH)
exports.updateClienteStatus = async (req, res) => {
  const { id } = req.params;
  const { estado_id } = req.body;
  try {
    console.log('info', `Request to update status of cliente - ID: ${id}`);
    const clienteResult = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
    if (clienteResult.rows.length === 0) {
      console.log('warn', `Cliente not found for status update - ID: ${id}`);
      return res.status(404).json({
        statusCode: 404,
        message: 'Cliente no encontrado',
        data: {},
        metadata: {}
      });
    }

    if (clienteResult.rows[0].estado_id === estado_id) {
      return res.status(400).json({
        statusCode: 400,
        message: 'El cliente ya se encuentra en ese estado',
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
      'UPDATE clientes SET estado_id = $1 WHERE id = $2 RETURNING *',
      [estado_id, id]
    );
    res.json({
      statusCode: 200,
      message: 'Estado del cliente actualizado con éxito',
      data: result.rows[0],
      metadata: {}
    });
  } catch (err) {
    console.log('error', `Error updating status of cliente - ${err.message}`);
    res.status(500).json({
      statusCode: 500,
      message: 'Error actualizando estado del cliente',
      data: {},
      metadata: {}
    });
  }
};
