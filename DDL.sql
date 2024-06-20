-- Crear catálogos de estados
CREATE TABLE estado_maquilador (
    id UUID PRIMARY KEY,
    descripcion VARCHAR NOT NULL
);

CREATE TABLE estado_usuario (
    id UUID PRIMARY KEY,
    descripcion VARCHAR NOT NULL
);

CREATE TABLE estado_inventario (
    id UUID PRIMARY KEY,
    descripcion VARCHAR NOT NULL
);

CREATE TABLE estado_orden_compra (
    id UUID PRIMARY KEY,
    descripcion VARCHAR NOT NULL
);

CREATE TABLE estado_orden_entrada (
    id UUID PRIMARY KEY,
    descripcion VARCHAR NOT NULL
);

CREATE TABLE estado_orden_salida (
    id UUID PRIMARY KEY,
    descripcion VARCHAR NOT NULL
);

CREATE TABLE estado_cotizacion (
    id UUID PRIMARY KEY,
    descripcion VARCHAR NOT NULL
);

-- Crear tablas principales
CREATE TABLE maquiladores (
    id UUID PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    direccion VARCHAR NOT NULL,
    capacidad INTEGER NOT NULL,
    estado_id UUID REFERENCES estado_maquilador(id)
);

CREATE TABLE clientes (
    id UUID PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    direccion VARCHAR NOT NULL,
    contacto VARCHAR NOT NULL,
    telefono VARCHAR NOT NULL,
    email VARCHAR NOT NULL
);

CREATE TABLE usuarios (
    id UUID PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    rol VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    contraseña VARCHAR NOT NULL,
    estado_id UUID REFERENCES estado_usuario(id)
);

CREATE TABLE inventario (
    id UUID PRIMARY KEY,
    producto VARCHAR NOT NULL,
    cantidad INTEGER NOT NULL,
    ubicacion VARCHAR NOT NULL,
    codigo_barras VARCHAR NOT NULL,
    estado_id UUID REFERENCES estado_inventario(id)
);

CREATE TABLE ordenes_compra (
    id UUID PRIMARY KEY,
    cliente_id UUID REFERENCES clientes(id),
    fecha DATE NOT NULL,
    estado_id UUID REFERENCES estado_orden_compra(id)
);

CREATE TABLE ordenes_entrada (
    id UUID PRIMARY KEY,
    proveedor_id UUID REFERENCES maquiladores(id),
    fecha DATE NOT NULL,
    estado_id UUID REFERENCES estado_orden_entrada(id)
);

CREATE TABLE ordenes_salida (
    id UUID PRIMARY KEY,
    cliente_id UUID REFERENCES clientes(id),
    fecha DATE NOT NULL,
    estado_id UUID REFERENCES estado_orden_salida(id)
);

CREATE TABLE cotizaciones (
    id UUID PRIMARY KEY,
    cliente_id UUID REFERENCES clientes(id),
    productos JSON NOT NULL,
    total DECIMAL NOT NULL,
    fecha DATE NOT NULL,
    estado_id UUID REFERENCES estado_cotizacion(id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_maquiladores_nombre ON maquiladores (nombre);
CREATE INDEX idx_clientes_nombre ON clientes (nombre);
CREATE INDEX idx_usuarios_email ON usuarios (email);
CREATE INDEX idx_inventario_codigo_barras ON inventario (codigo_barras);
CREATE INDEX idx_ordenes_compra_fecha ON ordenes_compra (fecha);
CREATE INDEX idx_ordenes_entrada_fecha ON ordenes_entrada (fecha);
CREATE INDEX idx_ordenes_salida_fecha ON ordenes_salida (fecha);
CREATE INDEX idx_cotizaciones_fecha ON cotizaciones (fecha);
