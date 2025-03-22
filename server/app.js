const express = require('express');
const virusTotalRoutes = require('./routes/virusTotal/virusTotalRoutes');
const leakCheckRoutes = require('./routes/leakCheck/leakCheckRoutes');
const pwnedPasswordsRoutes = require('./routes/leakCheck/pwnedPasswordsRoutes');
const urlExpanderRoutes = require('./routes/leakCheck/urlDecoderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors());

// Используем маршруты для обработки запросов
app.use('/api/virustotal', virusTotalRoutes);
app.use('/api/leakcheck', leakCheckRoutes);
app.use('/api/pwned', pwnedPasswordsRoutes);
app.use('/api/expand', urlExpanderRoutes);

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log('Зарегистрированные маршруты:');
    app._router.stack.forEach((r) => {
        if (r.route && r.route.path) {
            console.log(r.route.path, r.route.methods);
        }
    });
});