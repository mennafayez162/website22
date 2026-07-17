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
        // Allow all Vercel preview/production URLs, localhost, and Render itself
        const isVercel = origin && /^https:\/\/[\w-]+\.vercel\.app$/.test(origin);
        const isLocalhost = !origin || [
            'http://localhost:5000',
            'http://localhost:5500',
            'http://127.0.0.1:5500',
            'http://localhost:8080',
            'http://127.0.0.1:8080',
            'http://localhost:3000',
            'https://website22.onrender.com',
        ].includes(origin);

        if (isVercel || isLocalhost) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS: ' + origin));
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