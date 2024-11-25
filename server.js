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

    // Generación de 10 preguntas de ejemplo (puedes modificar según tu lógica)
    const preguntas = [
        { tipo: 'Opción múltiple', pregunta: '¿Cuál es la capital de Francia?', opciones: ['París', 'Londres', 'Roma', 'Madrid'] },
        { tipo: 'Pregunta abierta', pregunta: 'Explica el ciclo del agua.' },
        { tipo: 'Opción múltiple', pregunta: '¿Qué gas respiramos principalmente?', opciones: ['Oxígeno', 'Nitrógeno', 'Dióxido de carbono', 'Helio'] },
        { tipo: 'Pregunta abierta', pregunta: 'Describe la función de las hojas en una planta.' },
        { tipo: 'Opción múltiple', pregunta: '¿Cuál es el océano más grande del mundo?', opciones: ['Atlántico', 'Pacífico', 'Índico', 'Ártico'] },
        { tipo: 'Pregunta abierta', pregunta: '¿Qué son los derechos humanos?' },
        { tipo: 'Opción múltiple', pregunta: '¿Cuántos planetas hay en el sistema solar?', opciones: ['7', '8', '9', '10'] },
        { tipo: 'Pregunta abierta', pregunta: 'Escribe una breve biografía de tu científico favorito.' },
        { tipo: 'Opción múltiple', pregunta: '¿Qué órgano bombea la sangre en el cuerpo humano?', opciones: ['Hígado', 'Riñón', 'Cerebro', 'Corazón'] },
        { tipo: 'Pregunta abierta', pregunta: 'Describe los pasos del método científico.' },
    ];

    // Enviar los datos de curso, tema y preguntas como JSON
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
