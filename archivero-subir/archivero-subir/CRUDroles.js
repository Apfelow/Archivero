const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Sirve automáticamente tus archivos HTML, CSS y JS

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        
    password: 'ILoveKittens#707', 
    database: 'archivero'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos MySQL:', err);
        return;
    }
    console.log('Conectado exitosamente a la base de datos MySQL (archivero).');
});

app.get('/api/roles', (req, res) => {
    db.query('SELECT idRoles, Nombre, Descripcion FROM Roles', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/api/roles', (req, res) => {
    const { nombre, descripcion } = req.body;
    const query = 'INSERT INTO Roles (Nombre, Descripcion) VALUES (?, ?)';
    db.query(query, [nombre, descripcion], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ message: 'Rol creado con éxito', id: result.insertId });
    });
});

app.delete('/api/roles/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Roles WHERE idRoles = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Rol eliminado con éxito' });
    });
});


app.get('/api/usuarios', (req, res) => {
    db.query('SELECT idUsuarios, Nombre, Apellido_paterno FROM Usuarios', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});


app.get('/api/documentos', (req, res) => {
    db.query('SELECT idDocumento, Foto FROM Documento', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Obtener listado completo de préstamos con sus relaciones (JOINs)
app.get('/api/prestamos', (req, res) => {
    const query = `
        SELECT p.idPrestamo, p.Fecha_prestamo, p.Fecha_entrega, p.Documento_idDocumento AS idDocumento,
               CONCAT(t.Nombre, ' ', t.Apellido_paterno) AS Trabajador,
               CONCAT(u.Nombre, ' ', u.Apellido_paterno) AS Usuario,
               e.Estatus
        FROM Prestamo p
        JOIN Usuarios u ON p.Usuarios_idUsuarios = u.idUsuarios
        JOIN Documento d ON p.Documento_idDocumento = d.idDocumento
        JOIN Trabajadores t ON d.Trabajadores_idTrabajadores = t.idTrabajadores
        JOIN Estatus e ON d.Estatus_idEstatus = e.idEstatus
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Registrar un nuevo préstamo (INSERT)
app.post('/api/prestamos', (req, res) => {
    const { usuario_id, documento_id, fecha_prestamo, fecha_entrega } = req.body;
    const query = 'INSERT INTO Prestamo (Usuarios_idUsuarios, Documento_idDocumento, Fecha_prestamo, Fecha_entrega) VALUES (?, ?, ?, ?)';
    db.query(query, [usuario_id, documento_id, fecha_prestamo, fecha_entrega], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ message: 'Préstamo registrado con éxito' });
    });
});

app.delete('/api/prestamos/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM Prestamo WHERE idPrestamo = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Préstamo eliminado' });
    });
});

app.listen(3000, () => {
    console.log('Servidor web corriendo en http://localhost:3000');
});