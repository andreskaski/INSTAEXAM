const express = require('express');
consconst express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para procesar datos JSON (por si se requiere en otras partes)
app.use(express.json());

// Ruta principal para el formulario de inicio de sesión o registro
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para el dashboard (página de generación de exámenes)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Ruta para manejar la generación de exámenes
app.post('/generar_examen', (req, res) => {
    // Aquí procesarías la lógica para generar el examen
    // En este ejemplo, simplemente enviamos la página de resultados
    res.sendFile(path.join(__dirname, 'public', 'result.html'));
});

// Ruta para manejar otros errores o rutas no definidas
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

