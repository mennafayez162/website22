const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ===== تسجيل الدخول =====
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'الرجاء إدخال اسم المستخدم وكلمة المرور'
            });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'بيانات غير صحيحة'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'بيانات غير صحيحة'
            });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'eansr_super_secret_key_2026',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    name: user.name || user.username
                }
            }
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ===== إنشاء مستخدم أدمن =====
router.post('/seed-admin', async (req, res) => {
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if (adminExists) {
            return res.json({
                success: false,
                message: 'Admin already exists'
            });
        }

        const admin = await User.create({
            username: 'admin',
            email: 'admin@eansr.org',
            password: 'admin123',
            name: 'مدير النظام',
            role: 'admin',
            isActive: true
        });

        res.json({
            success: true,
            message: 'Admin created successfully!',
            data: {
                username: admin.username,
                password: 'admin123'
            }
        });

    } catch (error) {
        console.error('❌ Seed error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ===== جلب بيانات المستخدم =====
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'غير مصرح بالدخول'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'eansr_super_secret_key_2026');
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'المستخدم غير موجود'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'توكن غير صالح'
        });
    }
});

module.exports = router;