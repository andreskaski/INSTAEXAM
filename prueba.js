const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; 

async function pruebaConexion() {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',  // El modelo que estás probando
                messages: [
                    { role: "user", content: "¿Cuál es la capital de Francia?" }
                ],
                max_tokens: 10,
            },
            {
                headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
            }
        );
        console.log('Respuesta de la API:', response.data.choices[0].message.content);
    } catch (error) {
        console.error('Error en la conexión:', error.response ? error.response.data : error.message);
    }
}

pruebaConexion();
