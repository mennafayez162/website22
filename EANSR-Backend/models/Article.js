const supabase = require('../config/supabase');

const TABLE = 'articles';

const Article = {
    async create({ title, content, summary = '', category = 'article', image = '', pdf = '', author, authorName = 'EANSR', published = true, featured = false, tags = [] }) {
        const { data, error } = await supabase
            .from(TABLE)
            .insert({
                title,
                content,
                summary,
                category,
                image,
                pdf,
                author,
                author_name: authorName,
                published,
                featured,
                tags
            })
            .select('*')
            .single();

        if (error) throw error;
        return data;
    },

    async find(filter = {}) {
        let query = supabase.from(TABLE).select('*, users:author(username, name)');

        if (filter.category) {
            query = query.eq('category', filter.category);
        }
        if (filter.published !== undefined) {
            query = query.eq('published', filter.published);
        }

        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;
        if (error) throw error;

        return (data || []).map(a => ({
            ...a,
            author: a.users,
            users: undefined,
            author_name: a.author_name
        }));
    },

    async findById(id) {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*, users:author(username, name)')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        if (!data) return null;

        return {
            ...data,
            author: data.users,
            users: undefined,
            author_name: data.author_name
        };
    },

    async incrementViews(id) {
        const { data: current, error: fetchError } = await supabase
            .from(TABLE)
            .select('views')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        const { error } = await supabase
            .from(TABLE)
            .update({ views: (current.views || 0) + 1 })
            .eq('id', id);

        if (error) throw error;
    },

    async update(id, updates) {
        const dbUpdates = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.content !== undefined) dbUpdates.content = updates.content;
        if (updates.summary !== undefined) dbUpdates.summary = updates.summary;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.image !== undefined) dbUpdates.image = updates.image;
        if (updates.pdf !== undefined) dbUpdates.pdf = updates.pdf;
        if (updates.published !== undefined) dbUpdates.published = updates.published;
        if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
        dbUpdates.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from(TABLE)
            .update(dbUpdates)
            .eq('id', id)
            .select('*')
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from(TABLE)
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

module.exports = Article;
