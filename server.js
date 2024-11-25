const express = require('express');
const path = require('path');
const axios = require('axios'); // Importa axios para realizar solicitudes HTTP
const app = express();
const PORT = process.env.PORT || 3000; // Usa el puerto proporcionado por Render o el 3000

// Middleware para procesar formularios y JSON
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

    // Prompt para la IA
    const prompt = `Crea un examen con 10 preguntas variadas y creativas sobre el tema '${tema}' para estudiantes de ${curso} con dificultad ${dificultad}. Las preguntas deben incluir:
    - Una combinación de opción múltiple, preguntas abiertas y ejercicios prácticos.
    - Evita repetir preguntas.
    - Proporciona el texto de cada pregunta claramente.`;

    try {
        // Llama a la API de OpenAI
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4', // Cambia a 'gpt-3.5-turbo' si usas esa versión
                messages: [{ role: "user", content: prompt }],
                max_tokens: 700,
                temperature: 0.7
            },
            {
                headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
            }
        );

        // Formatea la respuesta de la IA
        const examenGenerado = response.data.choices[0].message.content.trim();

        // Envía el examen generado como HTML al cliente
        res.send(`
            <html>
            <head>
                <title>Examen Generado</title>
                <link rel="stylesheet" href="/styles.css">
            </head>
            <body>
                <div class="exam-container">
                    <header>
                        <h1>Examen Generado</h1>
                        <p><strong>Curso:</strong> ${curso}</p>
                        <p><strong>Tema:</strong> ${tema}</p>
                    </header>
                    <section class="questions">
                        ${examenGenerado.split('\n').map((q, i) => `<div class="question-card"><h3>Pregunta ${i + 1}:</h3><p>${q}</p></div>`).join('')}
                    </section>
                    <footer>
                        <a href="/dashboard" class="button">Volver al Panel</a>
                    </footer>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error al generar el examen:', error.response ? error.response.data : error.message);
        res.status(500).send('Error al generar el examen. Inténtalo de nuevo más tarde.');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
