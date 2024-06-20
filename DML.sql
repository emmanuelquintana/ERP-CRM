-- Insertar datos en estado_maquilador
INSERT INTO estado_maquilador (id, descripcion) VALUES (1, 'Activo');
INSERT INTO estado_maquilador (id, descripcion) VALUES (2, 'Inactivo');

-- Insertar datos en estado_usuario
INSERT INTO estado_usuario (id, descripcion) VALUES (1, 'Activo');
INSERT INTO estado_usuario (id, descripcion) VALUES (2, 'Inactivo');

-- Insertar datos en estado_inventario
INSERT INTO estado_inventario (id, descripcion) VALUES (1, 'Disponible');
INSERT INTO estado_inventario (id, descripcion) VALUES (2, 'Agotado');

-- Insertar datos en estado_orden_compra
INSERT INTO estado_orden_compra (id, descripcion) VALUES (1, 'Pendiente');
INSERT INTO estado_orden_compra (id, descripcion) VALUES (2, 'Completada');
INSERT INTO estado_orden_compra (id, descripcion) VALUES (3, 'Cancelada');

-- Insertar datos en estado_orden_entrada
INSERT INTO estado_orden_entrada (id, descripcion) VALUES (1, 'Pendiente');
INSERT INTO estado_orden_entrada (id, descripcion) VALUES (2, 'Recibida');

-- Insertar datos en estado_orden_salida
INSERT INTO estado_orden_salida (id, descripcion) VALUES (1, 'Pendiente');
INSERT INTO estado_orden_salida (id, descripcion) VALUES (2, 'Enviada');
INSERT INTO estado_orden_salida (id, descripcion) VALUES (3, 'Entregada');

-- Insertar datos en estado_cotizacion
INSERT INTO estado_cotizacion (id, descripcion) VALUES (1, 'Pendiente');
INSERT INTO estado_cotizacion (id, descripcion) VALUES (2, 'Aceptada');
INSERT INTO estado_cotizacion (id, descripcion) VALUES (3, 'Rechazada');


INSERT INTO estado_cliente (id, descripcion) VALUES (1, 'Activo');
INSERT INTO estado_cliente (id, descripcion) VALUES (2, 'Inactivo');