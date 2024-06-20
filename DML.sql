-- Insertar datos en estado_maquilador
INSERT INTO estado_maquilador (id, descripcion) VALUES (uuid_generate_v4(), 'Activo');
INSERT INTO estado_maquilador (id, descripcion) VALUES (uuid_generate_v4(), 'Inactivo');

-- Insertar datos en estado_usuario
INSERT INTO estado_usuario (id, descripcion) VALUES (uuid_generate_v4(), 'Activo');
INSERT INTO estado_usuario (id, descripcion) VALUES (uuid_generate_v4(), 'Inactivo');

-- Insertar datos en estado_inventario
INSERT INTO estado_inventario (id, descripcion) VALUES (uuid_generate_v4(), 'Disponible');
INSERT INTO estado_inventario (id, descripcion) VALUES (uuid_generate_v4(), 'Agotado');

-- Insertar datos en estado_orden_compra
INSERT INTO estado_orden_compra (id, descripcion) VALUES (uuid_generate_v4(), 'Pendiente');
INSERT INTO estado_orden_compra (id, descripcion) VALUES (uuid_generate_v4(), 'Completada');
INSERT INTO estado_orden_compra (id, descripcion) VALUES (uuid_generate_v4(), 'Cancelada');

-- Insertar datos en estado_orden_entrada
INSERT INTO estado_orden_entrada (id, descripcion) VALUES (uuid_generate_v4(), 'Pendiente');
INSERT INTO estado_orden_entrada (id, descripcion) VALUES (uuid_generate_v4(), 'Recibida');

-- Insertar datos en estado_orden_salida
INSERT INTO estado_orden_salida (id, descripcion) VALUES (uuid_generate_v4(), 'Pendiente');
INSERT INTO estado_orden_salida (id, descripcion) VALUES (uuid_generate_v4(), 'Enviada');
INSERT INTO estado_orden_salida (id, descripcion) VALUES (uuid_generate_v4(), 'Entregada');

-- Insertar datos en estado_cotizacion
INSERT INTO estado_cotizacion (id, descripcion) VALUES (uuid_generate_v4(), 'Pendiente');
INSERT INTO estado_cotizacion (id, descripcion) VALUES (uuid_generate_v4(), 'Aceptada');
INSERT INTO estado_cotizacion (id, descripcion) VALUES (uuid_generate_v4(), 'Rechazada');
