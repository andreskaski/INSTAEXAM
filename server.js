const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para procesar datos JSON y formularios codificados en URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal para el formulario de inicio de sesión o registro
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

// Ruta para manejar el formulario de inicio y redirigir al dashboard
app.post('/dashboard', (req, res) => {
    console.log('Datos recibidos del formulario:', req.body);
    res.sendFile(path.resolve(__dirname, 'public/dashboard.html'));
});

// Ruta para el dashboard (página de generación de exámenes)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/dashboard.html'));
});

// Ruta para manejar la generación de exámenes
app.post('/generar_examen', (req, res) => {
    console.log('Generando examen con datos:', req.body);
    // Aquí podrías generar dinámicamente las 10 preguntas y pasarlas como JSON
    const preguntas = [
        // Simulación de 10 preguntas (agrega más preguntas dinámicamente si es necesario)
        { tipo: 'Opción múltiple', pregunta: 'Pregunta 1', opciones: ['a', 'b', 'c', 'd'] },
        { tipo: 'Pregunta abierta', pregunta: 'Pregunta 2' },
        // ... Rellena hasta 10 preguntas
    ];
    res.json({ curso: req.body.curso, tema: req.body.tema, preguntas });
});

// Ruta para manejar errores de rutas no definidas
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
