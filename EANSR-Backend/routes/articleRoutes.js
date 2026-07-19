const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const { category, published } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (published !== undefined) filter.published = published === 'true';

        const articles = await Article.find(filter);
        res.json({ success: true, data: articles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ success: false, message: 'Not found' });
        await Article.incrementViews(req.params.id);
        article.views = (article.views || 0) + 1;
        res.json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { title, content, summary, category, image, published } = req.body;
        const article = await Article.create({
            title, content, summary, category, image,
            published: published !== undefined ? published : true,
            author: req.user.id,
            authorName: req.user.name || req.user.username
        });
        res.status(201).json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ success: false, message: 'Not found' });
        if (article.author !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        const { title, content, summary, category, image, published } = req.body;
        const updated = await Article.update(req.params.id, { title, content, summary, category, image, published });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ success: false, message: 'Not found' });
        if (article.author !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        await Article.delete(req.params.id);
        res.json({ success: true, message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
