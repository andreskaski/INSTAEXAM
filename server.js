const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

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

    const prompt = `Crea un examen con 10 preguntas variadas sobre el tema '${tema}' para estudiantes de ${curso} con dificultad ${dificultad}. Devuelve las preguntas en un formato JSON como:
    [
        { "tipo": "Opción múltiple", "pregunta": "Pregunta aquí", "opciones": ["a", "b", "c", "d"] },
        { "tipo": "Pregunta abierta", "pregunta": "Pregunta aquí" }
    ]`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000,
                temperature: 0.7,
            },
            { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
        );

        const examenPreguntas = response.data.choices[0].message.content.trim();
        const preguntas = JSON.parse(examenPreguntas); // Convierte la respuesta en JSON válido

        // Enviar los datos del examen al cliente
        res.json({ curso, tema, preguntas });
    } catch (error) {
        console.error('Error al generar el examen:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error al generar el examen. Inténtalo nuevamente.' });
    }
});

// Ruta para regenerar una pregunta
app.post('/regenerate_question', async (req, res) => {
    const { index, curso, tema } = req.body;

    const prompt = `Genera una nueva pregunta sobre el tema '${tema}' para estudiantes de ${curso}. Devuelve la pregunta en un formato JSON como:
    { "tipo": "Pregunta abierta", "pregunta": "Pregunta aquí" }`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.7,
            },
            { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
        );

        const nuevaPregunta = JSON.parse(response.data.choices[0].message.content.trim());
        res.json({ index, pregunta: nuevaPregunta });
    } catch (error) {
        console.error('Error al regenerar la pregunta:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error al regenerar la pregunta. Inténtalo nuevamente.' });
    }
});

// Ruta para servir la página de resultados
app.get('/result', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'result.html'));
});

// Ruta para manejar errores de rutas no definidas
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
