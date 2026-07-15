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
        const articles = await Article.find(filter).sort({ createdAt: -1 }).populate('author', 'username name');
        res.json({ success: true, data: articles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ success: false, message: 'Not found' });
        article.views += 1;
        await article.save();
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
            author: req.user._id,
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
        if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        const { title, content, summary, category, image, published } = req.body;
        article.title = title || article.title;
        article.content = content || article.content;
        article.summary = summary || article.summary;
        article.category = category || article.category;
        article.image = image || article.image;
        article.published = published !== undefined ? published : article.published;
        article.updatedAt = Date.now();
        await article.save();
        res.json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ success: false, message: 'Not found' });
        if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        await article.deleteOne();
        res.json({ success: true, message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;