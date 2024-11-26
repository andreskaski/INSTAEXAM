const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Dashboard
app.post('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Generar examen
app.post('/generar_examen', async (req, res) => {
    const { curso, tema, dificultad } = req.body;

    const prompt = `
        Crea un examen con 10 preguntas sobre el tema '${tema}' para estudiantes de ${curso}, con una dificultad de nivel '${dificultad}'. 
        Usa un máximo de 2 preguntas de opción múltiple. Las demás deben ser preguntas abiertas o ejercicios prácticos. 
        Devuelve un JSON con un array de objetos donde cada objeto tenga las claves:
        'tipo' (opción múltiple, pregunta abierta, ejercicio práctico), 'pregunta' y opcionalmente 'opciones' (si es opción múltiple).
    `;

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
            console.error('Error al parsear JSON:', jsonError.message);
            res.status(500).send('La respuesta no es un JSON válido.');
        }
    } catch (error) {
        console.error('Error al generar el examen:', error.message);
        res.status(500).send('Error al generar el examen.');
    }
});

// Regenerar una pregunta
app.post('/regenerate_question', async (req, res) => {
    const { index, curso, tema } = req.body;

    const prompt = `
        Genera una nueva pregunta sobre el tema '${tema}' para estudiantes de ${curso}. 
        Devuelve un JSON con las claves 'tipo', 'pregunta', y opcionalmente 'opciones' si es opción múltiple.
    `;

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
            console.error('Error al parsear JSON:', jsonError.message);
            res.status(500).send('La respuesta no es un JSON válido.');
        }
    } catch (error) {
        console.error('Error al regenerar la pregunta:', error.message);
        res.status(500).send('Error al regenerar la pregunta.');
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
