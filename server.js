const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sirve archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Página de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Panel de control
app.post('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Generar examen
app.post('/generar_examen', async (req, res) => {
    const { curso, tema, dificultad } = req.body;

    const prompt = `Crea un examen con 10 preguntas variadas sobre el tema '${tema}' para estudiantes de ${curso} con dificultad ${dificultad}. 
    Devuelve las preguntas en formato JSON como un array de objetos con las claves: 
    'tipo' (Opción múltiple, Pregunta abierta, Ejercicio práctico), 'pregunta', y opcionalmente 'opciones' (array de opciones para preguntas de opción múltiple).`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000,
                temperature: 0.5,
            },
            { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
        );

        const rawResponse = response.data.choices[0].message.content.trim();

        try {
            const preguntasGeneradas = JSON.parse(rawResponse);
            if (!Array.isArray(preguntasGeneradas)) {
                throw new Error('El JSON generado no contiene un array válido.');
            }

            res.json({ curso, tema, preguntas: preguntasGeneradas });
        } catch (jsonError) {
            console.error('Error al parsear el JSON:', jsonError.message);
            console.error('Respuesta de OpenAI:', rawResponse);
            res.status(500).json({ error: 'Error al generar el examen. Respuesta no válida.' });
        }
    } catch (error) {
        console.error('Error en la API de OpenAI:', error.message);
        res.status(500).json({ error: 'Error al generar el examen.' });
    }
});

// Regenerar pregunta
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
                temperature: 0.5,
            },
            { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
        );

        const rawResponse = response.data.choices[0].message.content.trim();

        try {
            const nuevaPregunta = JSON.parse(rawResponse);
            if (!nuevaPregunta.pregunta || !nuevaPregunta.tipo) {
                throw new Error('La pregunta generada no contiene las claves necesarias.');
            }

            res.json({ index, pregunta: nuevaPregunta });
        } catch (jsonError) {
            console.error('Error al parsear el JSON:', jsonError.message);
            console.error('Respuesta de OpenAI:', rawResponse);
            res.status(500).json({ error: 'Error al regenerar la pregunta. Respuesta no válida.' });
        }
    } catch (error) {
        console.error('Error en la API de OpenAI:', error.message);
        res.status(500).json({ error: 'Error al regenerar la pregunta.' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
