const jwt = require('jsonwebtoken');

// Middleware para proteger rutas
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      message: 'Token requerido',
      data: {},
      metadata: {}
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        statusCode: 403,
        message: 'Token inválido',
        data: {},
        metadata: {}
      });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };