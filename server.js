// server.js
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Permitir solicitudes desde cualquier origen (para el frontend)
app.use(cors());
app.use(express.json());

// Configurar Multer para recibir archivos
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint para subir PDF
app.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No se subió ningún PDF' });

        const data = await pdfParse(req.file.buffer);
        const text = data.text.replace(/\s+/g, ' ').trim(); // limpiar espacios extra
        res.json({ text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error procesando el PDF' });
    }
});

// Endpoint de prueba
app.get('/', (req, res) => {
    res.send('Servidor backend funcionando');
});

app.listen(PORT, () => console.log(`Servidor backend corriendo en http://localhost:${PORT}`));
