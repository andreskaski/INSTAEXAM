const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configura tu API Key de OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/generar_examen', async (req, res) => {
    const { curso, tema, dificultad, visuales } = req.body;

    // Prompt optimizado para generar 10 preguntas variadas y creativas
    const prompt = `Crea un examen con 10 preguntas variadas y creativas sobre el tema '${tema}' para estudiantes de ${curso} con dificultad ${dificultad}. Las preguntas deben incluir una combinación de opción múltiple, preguntas abiertas y ejercicios prácticos. Evita repetir preguntas y proporciona solo el texto de las preguntas. Si es posible, incluye ${Array.isArray(visuales) ? visuales.join(', ') : 'elementos visuales apropiados'}.`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4', // Puedes cambiar a 'gpt-3.5-turbo' si no tienes acceso a GPT-4
                messages: [
                    { role: "user", content: prompt }
                ],
                max_tokens: 700, // Aumentado para permitir espacio suficiente para 10 preguntas
                temperature: 0.7 // Mayor creatividad en las respuestas
            },
            {
                headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
            }
        );

        const examenGenerado = response.data.choices[0].message.content.trim();
        res.send(`<h1>Examen Generado</h1><pre>${examenGenerado}</pre><a href="/">Volver</a>`);
    } catch (error) {
        console.error('Error al generar el examen:', error.response ? error.response.data : error.message);
        res.status(500).send('Error al generar el examen');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
