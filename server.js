const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sirve archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la página de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para el dashboard
app.post('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Ruta para generar el examen
app.post('/generar_examen', async (req, res) => {
    const { curso, tema, dificultad } = req.body;

    const prompt = `Crea un examen con 10 preguntas variadas sobre el tema '${tema}' para estudiantes de ${curso} con dificultad ${dificultad}. 
    Incluye un máximo de 2 preguntas de opción múltiple, el resto deben ser preguntas abiertas y prácticas. Devuelve las preguntas en formato JSON con las claves: 'tipo', 'pregunta', y 'opciones' (opcional para preguntas de opción múltiple).`;

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

        const rawResponse = response.data.choices[0].message.content.trim();

        try {
            const preguntasGeneradas = JSON.parse(rawResponse);
            res.json({ curso, tema, preguntas: preguntasGeneradas });
        } catch (jsonError) {
            console.error('Error al parsear el JSON de OpenAI:', jsonError.message);
            console.error('Respuesta de OpenAI:', rawResponse);
            res.status(500).send('Error al generar el examen. La respuesta no es válida.');
        }
    } catch (error) {
        console.error('Error al llamar a la API de OpenAI:', error.message);
        res.status(500).send('Error al generar el examen.');
    }
});

// Ruta para regenerar una pregunta específica
app.post('/regenerate_question', async (req, res) => {
    const { index, curso, tema } = req.body;

    const prompt = `Genera una nueva pregunta sobre el tema '${tema}' para estudiantes de ${curso}. 
    Devuelve la pregunta en formato JSON con las claves: 'tipo', 'pregunta', y opcionalmente 'opciones'.`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 200,
                temperature: 0.7,
            },
            { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
        );

        const rawResponse = response.data.choices[0].message.content.trim();

        try {
            const nuevaPregunta = JSON.parse(rawResponse);
            res.json({ pregunta: nuevaPregunta });
        } catch (jsonError) {
            console.error('Error al parsear el JSON de OpenAI:', jsonError.message);
            console.error('Respuesta de OpenAI:', rawResponse);
            res.status(500).send('Error al regenerar la pregunta. La respuesta no es válida.');
        }
    } catch (error) {
        console.error('Error al regenerar la pregunta:', error.message);
        res.status(500).send('Error al regenerar la pregunta.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
