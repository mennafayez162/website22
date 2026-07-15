const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// ===== تحميل المتغيرات =====
dotenv.config();

// ===== الاتصال بقاعدة البيانات =====
connectDB();

const app = express();

// ===== Middleware =====
app.use(cors());
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