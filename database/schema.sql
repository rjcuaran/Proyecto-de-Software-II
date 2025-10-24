-- Crear base de datos
CREATE DATABASE IF NOT EXISTS organizador_recetas;
USE organizador_recetas;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Categorías
CREATE TABLE IF NOT EXISTS Categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50)
);

-- Tabla de Recetas
CREATE TABLE IF NOT EXISTS Receta (
    id_receta INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    id_categoria INT,
    descripcion TEXT,
    preparacion TEXT,
    tiempo_preparacion INT, -- en minutos
    porciones INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria)
);

-- Tabla de Ingredientes
CREATE TABLE IF NOT EXISTS Ingrediente (
    id_ingrediente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    cantidad DECIMAL(8,2),
    unidad_medida VARCHAR(50),
    id_receta INT NOT NULL,
    FOREIGN KEY (id_receta) REFERENCES Receta(id_receta) ON DELETE CASCADE
);

-- Tabla de Favoritos
CREATE TABLE IF NOT EXISTS Favorito (
    id_favorito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_receta INT NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_receta) REFERENCES Receta(id_receta) ON DELETE CASCADE,
    UNIQUE KEY unique_favorito (id_usuario, id_receta)
);

-- Insertar categorías predefinidas
INSERT INTO Categoria (nombre, descripcion, icono) VALUES 
('Desayunos', 'Recetas para empezar el día con energía', '🍳'),
('Ensaladas', 'Platos frescos y saludables', '🥗'),
('Sopas', 'Reconfortantes y nutritivas', '🍲'),
('Platos Principales', 'Comidas completas y sustanciosas', '🍽️'),
('Pastas', 'Deliciosos platos de pasta', '🍝'),
('Postres', 'Dulces tentaciones', '🍰'),
('Bebidas', 'Refrescantes y reconfortantes', '🥤'),
('Aperitivos', 'Snacks y entradas', '🍤');

-- Índices para mejorar rendimiento
CREATE INDEX idx_receta_nombre ON Receta(nombre);
CREATE INDEX idx_receta_categoria ON Receta(id_categoria);
CREATE INDEX idx_receta_usuario ON Receta(id_usuario);
CREATE INDEX idx_ingrediente_nombre ON Ingrediente(nombre);
CREATE INDEX idx_usuario_correo ON Usuario(correo);