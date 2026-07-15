const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String, default: '' },
    category: { type: String, enum: ['research', 'article', 'journal', 'news', 'gallery'], default: 'article' },
    image: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String, default: 'EANSR' },
    views: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    tags: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);