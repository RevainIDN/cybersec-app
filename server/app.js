const express = require('express');
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config/config');
const Role = require('./models/Role');
const virusTotalRoutes = require('./routes/virusTotal/virusTotalRoutes');
const leakCheckRoutes = require('./routes/leakCheck/leakCheckRoutes');
const pwnedPasswordsRoutes = require('./routes/leakCheck/pwnedPasswordsRoutes');
const urlExpanderRoutes = require('./routes/leakCheck/urlDecoderRoutes');
const geminiChatRoutes = require('./routes/geminiChat/geminiChatRoutes');
const authRouter = require('./routes/authorization/authRouter');
const passwordManagerRoutes = require('./routes/passwordManager/passwordManagerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors());
app.use(express.json());

// Используем маршруты для обработки запросов
app.use('/api/virustotal', virusTotalRoutes);
app.use('/api/leakcheck', leakCheckRoutes);
app.use('/api/pwned', pwnedPasswordsRoutes);
app.use('/api/expand', urlExpanderRoutes);
app.use('/api/gemini', geminiChatRoutes);
app.use('/api/passwords', passwordManagerRoutes);
app.use('/auth', authRouter)

const start = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
            app._router.stack.forEach((r) => {
                if (r.route && r.route.path) {
                    console.log(r.route.path, r.route.methods);
                }
            });
        });
    } catch (error) {
        console.log(error)
    }
}

start()