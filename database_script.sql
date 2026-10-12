CREATE TABLE  Usuarios (
  idUsuarios INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  Roles_idRoles INTEGER UNSIGNED NOT NULL,
  Nombre VARCHAR NULL,
  Apellido_paterno VARCHAR NULL,
  Apellido_materno VARCHAR NULL,
  Contraseña VARCHAR NULL,
  PRIMARY KEY(idUsuarios),
);

CREATE TABLE Cajas (
  idCajas INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  Estantes_idEstantes INTEGER UNSIGNED NOT NULL,
  Caja INTEGER UNSIGNED NULL,
  Descripcion VARCHAR NULL,
  PRIMARY KEY(idCajas),
);

CREATE TABLE Departamentos (
  idDepartamentos INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  Nombre VARCHAR(30) NULL,
  PRIMARY KEY(idDepartamentos)
);

CREATE TABLE Documento (
  idDocumento INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  Cajas_idCajas INTEGER UNSIGNED NOT NULL,
  Estatus_idEstatus INTEGER UNSIGNED NOT NULL,
  Trabajadores_idTrabajadores INTEGER UNSIGNED NOT NULL,
  Foto INTEGER UNSIGNED NULL,
  PRIMARY KEY(idDocumento),
);

CREATE TABLE Estantes (
  idEstantes INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  Estante INTEGER UNSIGNED NULL,
  Descripcion VARCHAR NULL,
  PRIMARY KEY(idEstantes)
);

CREATE TABLE Estatus (
  idEstatus INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  Estatus VARCHAR(20) NULL,
  PRIMARY KEY(idEstatus)
);

CREATE TABLE Prestamo (
  idPrestamo INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  Trabajadores_idTrabajadores INTEGER UNSIGNED NOT NULL,
  Tipo_documento_idTipo_documento INTEGER UNSIGNED NOT NULL,
   Usuarios_idUsuarios INTEGER UNSIGNED NOT NULL,
  Fecha_prestamo DATE NULL,
  Fecha_entrega DATE NULL,
  PRIMARY KEY(idPrestamo),
);

CREATE TABLE Roles (
  idRoles INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  Nombre VARCHAR(20) NULL,
  Descripcion VARCHAR(30) NULL,
  PRIMARY KEY(idRoles)
);

CREATE TABLE Tipo_documento (
  idTipo_documento INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  Nombre VARCHAR NULL,
  Descripcion VARCHAR NULL,
  PRIMARY KEY(idTipo_documento)
);

CREATE TABLE Trabajadores (
  idTrabajadores INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  Departamentos_idDepartamentos INTEGER UNSIGNED NOT NULL,
  Estatus_idEstatus INTEGER UNSIGNED NOT NULL,
  Nombre VARCHAR(25) NULL,
  Apellido_paterno VARCHAR(25) NULL,
  Apellido_materno VARCHAR(25) NULL,
  Fecha_ingreso DATE NULL,
  Matricula VARCHAR NULL,
  PRIMARY KEY(idTrabajadores),
);
