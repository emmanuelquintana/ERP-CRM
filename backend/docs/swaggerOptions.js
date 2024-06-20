const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'ERP/CRM API',
      version: '1.0.0',
      description: 'API para el sistema ERP/CRM'
    },
    basePath: '/',
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Maquilador: {
          type: 'object',
          required: ['nombre', 'direccion', 'capacidad', 'estado_id'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            nombre: {
              type: 'string',
              example: 'Nombre del Maquilador'
            },
            direccion: {
              type: 'string',
              example: 'Dirección del Maquilador'
            },
            capacidad: {
              type: 'integer',
              example: 1000
            },
            estado_id: {
              type: 'integer',
              example: 1
            }
          }
        },
        Cliente: {
          type: 'object',
          required: ['nombre', 'direccion', 'contacto', 'telefono', 'email', 'estado_id'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            nombre: {
              type: 'string',
              example: 'Nombre del Cliente'
            },
            direccion: {
              type: 'string',
              example: 'Dirección del Cliente'
            },
            contacto: {
              type: 'string',
              example: 'Nombre del Contacto'
            },
            telefono: {
              type: 'string',
              example: '1234567890'
            },
            email: {
              type: 'string',
              example: 'cliente@example.com'
            },
            estado_id: {
              type: 'integer',
              example: 1
            }
          }
        },
        Usuario: {
          type: 'object',
          required: ['nombre', 'email', 'password', 'role', 'estado_id'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            nombre: {
              type: 'string',
              example: 'Nombre del Usuario'
            },
            email: {
              type: 'string',
              example: 'usuario@example.com'
            },
            password: {
              type: 'string',
              example: 'password123'
            },
            role: {
              type: 'string',
              example: 'admin'
            },
            estado_id: {
              type: 'integer',
              example: 1
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token requerido',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  statusCode: {
                    type: 'integer'
                  },
                  message: {
                    type: 'string'
                  },
                  data: {
                    type: 'object'
                  },
                  metadata: {
                    type: 'object'
                  }
                }
              },
              examples: {
                example: {
                  value: {
                    statusCode: 401,
                    message: "Token requerido",
                    data: {},
                    metadata: {}
                  }
                }
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Token inválido',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  statusCode: {
                    type: 'integer'
                  },
                  message: {
                    type: 'string'
                  },
                  data: {
                    type: 'object'
                  },
                  metadata: {
                    type: 'object'
                  }
                }
              },
              examples: {
                example: {
                  value: {
                    statusCode: 403,
                    message: "Token inválido",
                    data: {},
                    metadata: {}
                  }
                }
              }
            }
          }
        },
        InternalServerError: {
          description: 'Error del servidor',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  statusCode: {
                    type: 'integer'
                  },
                  message: {
                    type: 'string'
                  },
                  data: {
                    type: 'object'
                  },
                  metadata: {
                    type: 'object'
                  }
                }
              },
              examples: {
                example: {
                  value: {
                    statusCode: 500,
                    message: "Error del servidor",
                    data: {},
                    metadata: {}
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
