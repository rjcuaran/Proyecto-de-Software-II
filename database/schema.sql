CREATE DATABASE IF NOT EXISTS organizador_recetas;
USE organizador_recetas;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Categorías predefinidas
CREATE TABLE IF NOT EXISTS Categorias (
    idCategoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(50)
);

-- Tabla de Recetas
CREATE TABLE IF NOT EXISTS Recetas (
    idReceta INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tiempo_preparacion INT, -- en minutos
    porciones INT,
    instrucciones TEXT,
    idUsuario INT,
    idCategoria INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    imagen VARCHAR(255),
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE,
    FOREIGN KEY (idCategoria) REFERENCES Categorias(idCategoria) ON DELETE SET NULL
);

-- Tabla de Ingredientes
CREATE TABLE IF NOT EXISTS Ingredientes (
    idIngrediente INT AUTO_INCREMENT PRIMARY KEY,
    idReceta INT,
    nombre VARCHAR(100) NOT NULL,
    cantidad DECIMAL(10,2),
    unidad VARCHAR(50),
    FOREIGN KEY (idReceta) REFERENCES Recetas(idReceta) ON DELETE CASCADE
);

-- Tabla de Favoritos
CREATE TABLE IF NOT EXISTS Favoritos (
    idFavorito INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idReceta INT,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE,
    FOREIGN KEY (idReceta) REFERENCES Recetas(idReceta) ON DELETE CASCADE,
    UNIQUE KEY unique_favorito (idUsuario, idReceta)
);

-- Insertar categorías predefinidas
INSERT IGNORE INTO Categorias (nombre, descripcion, icono) VALUES
('Desayunos', 'Recetas para empezar el día', '🥞'),
('Almuerzos', 'Platos principales para el mediodía', '🍲'),
('Cenas', 'Recetas para la última comida del día', '🍽️'),
('Postres', 'Dulces delicias para terminar', '🍰'),
('Ensaladas', 'Platos frescos y saludables', '🥗'),
('Sopas', 'Reconfortantes y calientes', '🍜'),
('Bebidas', 'Refrescantes y nutritivas', '🥤'),
('Vegetariano', 'Recetas sin carne', '🥦'),
('Rápidas', 'Preparación en menos de 30 min', '⚡');