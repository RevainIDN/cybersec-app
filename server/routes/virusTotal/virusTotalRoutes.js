const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const router = express.Router();
const fs = require('fs');
const { VT_API_KEY } = require('../../config/config');
const { getVirusTotalFileReport } = require('../../controllers/virusTotal/virusTotalController');

// Настройка multer для загрузки файла
const upload = multer({ dest: 'uploads/' });

const VIRUSTOTAL_API_KEY = { VT_API_KEY };

router.post('/files', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Файл не был загружен' });
    }

    console.log('Получен файл:', req.file);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path), req.file.originalname);

    try {
        const virusTotalResponse = await axios.post(
            'https://www.virustotal.com/api/v3/files',
            formData,
            {
                headers: {
                    'x-apikey': VIRUSTOTAL_API_KEY.VT_API_KEY,
                    ...formData.getHeaders(),
                },
            }
        );

        console.log('Ответ от VirusTotal:', virusTotalResponse.data);
        console.log(virusTotalResponse.data);
        res.json(virusTotalResponse.data);
    } catch (error) {
        console.error('Ошибка при отправке в VirusTotal:', error.response?.data || error.message);
        res.status(500).json({ error: 'Ошибка при отправке в VirusTotal' });
    } finally {
        // Удаляем файл после обработки
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Ошибка при удалении файла:', err);
        });
    }
});

router.get('/files/:fileId', getVirusTotalFileReport);

module.exports = router;