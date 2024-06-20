require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const maquiladoresRoutes = require('./routes/maquiladores');
const clientesRoutes = require('./routes/clientes'); // Importar las rutas de clientes
const swaggerUi = require('swagger-ui-express');
const usuariosRoutes = require('./routes/usuarios');

const swaggerDocs = require('./docs/swaggerOptions');

const app = express();
app.use(bodyParser.json());
app.use('/maquiladores', maquiladoresRoutes);
app.use('/clientes', clientesRoutes); 
app.use('/usuarios', usuariosRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
