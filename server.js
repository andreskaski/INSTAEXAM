const express = require('express');
const path = require('path');
const axios = require('axios'); // Importa axios si aún no lo tienes
const app = express();
const PORT = process.env.PORT || 3000; // Usa el puerto proporcionado por Render o el 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sirve archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la página de inicio (registro/login)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para el dashboard (panel de control)
app.post('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Ruta para generar el examen
app.post('/generar_examen', async (req, res) => {
    const { curso, tema, dificultad } = req.body;

    const prompt = `Crea un examen con 10 preguntas variadas y creativas sobre el tema '${tema}' para estudiantes de ${curso} con dificultad ${dificultad}. Las preguntas deben incluir una combinación de opción múltiple, preguntas abiertas y ejercicios prácticos. Evita repetir preguntas y proporciona solo el texto de las preguntas.`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4', // Cambia a 'gpt-3.5-turbo' si estás usando esa versión
                messages: [
                    { role: "user", content: prompt }
                ],
                max_tokens: 700,
                temperature: 0.7
            },
            {
                headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
            }
        );

        const examenGenerado = response.data.choices[0].message.content.trim();
        res.send(`<h1>Examen Generado</h1><pre>${examenGenerado}</pre><a href="/dashboard">Volver</a>`);
    } catch (error) {
        console.error('Error al generar el examen:', error.response ? error.response.data : error.message);
        res.status(500).send('Error al generar el examen');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});

