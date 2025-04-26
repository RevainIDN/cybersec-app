const express = require('express');
const mongoose = require('mongoose');
const { DB_PASSWORD } = require('./config/config');
const Role = require('./models/Role');
const virusTotalRoutes = require('./routes/virusTotal/virusTotalRoutes');
const leakCheckRoutes = require('./routes/leakCheck/leakCheckRoutes');
const pwnedPasswordsRoutes = require('./routes/leakCheck/pwnedPasswordsRoutes');
const urlExpanderRoutes = require('./routes/leakCheck/urlDecoderRoutes');
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
app.use('/api/passwords', passwordManagerRoutes);
app.use('/auth', authRouter)

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://kovigor94:${DB_PASSWORD}@clustercybersec.sm7cp.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCybersec`)
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