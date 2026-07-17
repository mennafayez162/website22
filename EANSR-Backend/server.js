const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// ===== تحميل المتغيرات =====
// path.resolve(__dirname, '.env') works in both local and Vercel serverless
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// ===== CORS =====
app.use(cors({
    origin: function(origin, callback) {
        // Allow all *.vercel.app subdomains (preview + production)
        const isVercel = origin && /^https:\/\/[\w-]+\.vercel\.app$/.test(origin);
        // Allow localhost for local development and Render
        const isAllowed = !origin || [
            'http://localhost:5000',
            'http://localhost:5500',
            'http://127.0.0.1:5500',
            'http://localhost:8080',
            'http://127.0.0.1:8080',
            'http://localhost:3000',
            'https://website22.onrender.com',
        ].includes(origin);

        if (isVercel || isAllowed) {
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

// ===== DB Connection Middleware (serverless-safe singleton pattern) =====
// connectDB() checks readyState so it only connects once per warm instance
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('❌ DB connection failed:', err.message);
        res.status(503).json({ success: false, message: 'Database unavailable' });
    }
});

// ===== Routes =====
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/articles', require('./routes/articleRoutes'));

// ===== Home Route =====
app.get('/', (req, res) => {
    res.send('🚀 Backend is running successfully');
});

// ===== تشغيل السيرفر (محلياً فقط) =====
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

// ===== Export for Vercel Serverless =====
module.exports = app;