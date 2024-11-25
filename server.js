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

    const prompt = `Crea un examen con 10 preguntas variadas sobre el tema '${tema}' para estudiantes de ${curso} con dificultad ${dificultad}. Las preguntas deben incluir opción múltiple, preguntas abiertas y ejercicios prácticos.`;
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 700,
                temperature: 0.7,
            },
            { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
        );

        const examenPreguntas = response.data.choices[0].message.content.trim();
        res.json({ curso, tema, preguntas: JSON.parse(examenPreguntas) });
    } catch (error) {
        console.error('Error al generar el examen:', error);
        res.status(500).send('Error al generar el examen');
    }
});

// Ruta para regenerar una pregunta
app.post('/regenerate_question', async (req, res) => {
    const { index, curso, tema } = req.body;

    const prompt = `Genera una nueva pregunta sobre el tema '${tema}' para estudiantes de ${curso}.`;
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

        const nuevaPregunta = response.data.choices[0].message.content.trim();
        res.json({ pregunta: nuevaPregunta });
    } catch (error) {
        console.error('Error al regenerar la pregunta:', error);
        res.status(500).send('Error al regenerar la pregunta');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
