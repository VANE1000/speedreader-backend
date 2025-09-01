const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para recibir la URL y devolver el texto
app.post('/get-text', async (req, res) => {
    const { url } = req.body;
    if(!url) return res.status(400).json({ error: "Falta la URL" });

    try {
        const response = await axios.get(url);
        const html = response.data;

        // Extraer solo texto básico eliminando etiquetas HTML
        const text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                         .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                         .replace(/<[^>]+>/g, ' ')
                         .replace(/\s+/g, ' ')
                         .trim();

        res.json({ text });
    } catch (err) {
        res.status(500).json({ error: "No se pudo obtener el texto" });
    }
});
app.get('/', (req, res) => {
    res.send('El backend de Speed Reader está funcionando. Usa POST /get-text para obtener texto.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
