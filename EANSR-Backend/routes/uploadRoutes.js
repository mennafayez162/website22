const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedImage = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const allowedPdf = ['application/pdf'];
        if (allowedImage.includes(file.mimetype) || allowedPdf.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed'));
        }
    }
});

router.post('/', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const file = req.file;
        const isPdf = file.mimetype === 'application/pdf';
        const bucket = isPdf ? 'pdfs' : 'images';
        const ext = path.extname(file.originalname) || (isPdf ? '.pdf' : '.png');
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        res.json({
            success: true,
            data: {
                url: urlData.publicUrl,
                name: file.originalname,
                type: isPdf ? 'pdf' : 'image'
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
