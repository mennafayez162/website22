const mongoose = require('mongoose');

const connectDB = async () => {
    // Singleton: don't reconnect if already connected (important for serverless)
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Error:', error.message);
        // Don't call process.exit(1) in serverless — it kills the function with no response
        throw error;
    }
};

module.exports = connectDB;