const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fetch = require('node-fetch');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// ----------------- Extraer texto de PDF -----------------
app.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    try {
        const dataBuffer = req.file.buffer;
        const data = await pdfParse(dataBuffer);
        res.json({ text: data.text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error procesando PDF' });
    }
});

// ----------------- Extraer texto de URL -----------------
app.post('/get-text', async (req, res) => {
    const { url } = req.body;
    try {
        const response = await fetch(url);
        const html = await response.text();
        // Extraemos texto simple eliminando etiquetas
        const text = html.replace(/<[^>]+>/g, ' ');
        res.json({ text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error obteniendo la URL' });
    }
});

// Mensaje en la raíz
app.get('/', (req, res) => res.send('Backend de Speed Reader funcionando'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
