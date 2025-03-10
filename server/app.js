const express = require('express');
const virusTotalRoutes = require('./routes/virusTotalRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors());

// Используем маршруты для обработки запросов
app.use('/api/virustotal', virusTotalRoutes);

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log('Зарегистрированные маршруты:');
    app._router.stack.forEach((r) => {
        if (r.route && r.route.path) {
            console.log(r.route.path, r.route.methods);
        }
    });
});