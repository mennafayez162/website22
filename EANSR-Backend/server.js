const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// ===== تحميل المتغيرات =====
dotenv.config();

// ===== الاتصال بقاعدة البيانات =====
connectDB();

const app = express();

// ===== CORS =====
app.use(cors({
    origin: function(origin, callback) {
        const allowed = [
            'https://eansr.vercel.app',
            'https://website22.onrender.com',
            'http://localhost:5000',
            'http://localhost:5500',
            'http://127.0.0.1:5500',
            'http://localhost:8080',
            'http://127.0.0.1:8080',
            'http://localhost:3000',
        ];
        // Allow file:// (null origin) and no-origin requests (Postman, etc.)
        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ===== Middleware =====
app.use(express.json());

// ===== Routes =====
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/articles', require('./routes/articleRoutes'));

// ===== Home Route =====
app.get('/', (req, res) => {
    res.send('🚀 Backend is running successfully');
});

// ===== تشغيل السيرفر =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});