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
    // Aquí puedes procesar los datos enviados desde el formulario en index.html
    console.log('Datos recibidos del formulario:', req.body);

    // Redirige al usuario al dashboard
    res.sendFile(path.resolve(__dirname, 'public/dashboard.html'));
});

// Ruta para el dashboard (página de generación de exámenes)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/dashboard.html'));
});

// Ruta para manejar la generación de exámenes
app.post('/generar_examen', (req, res) => {
    // Aquí procesarías la lógica para generar el examen
    console.log('Generando examen con datos:', req.body);

    // En este ejemplo, simplemente enviamos la página de resultados
    res.sendFile(path.resolve(__dirname, 'public/result.html'));
});

// Ruta para manejar errores de rutas no definidas
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
