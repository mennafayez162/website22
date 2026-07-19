const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

const TABLE = 'users';

const User = {
    async create({ username, email, password, name = '', role = 'viewer', isActive = true }) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { data, error } = await supabase
            .from(TABLE)
            .insert({
                username,
                email,
                password: hashedPassword,
                name,
                role,
                is_active: isActive
            })
            .select('id, username, email, name, role, is_active, created_at')
            .single();

        if (error) throw error;
        return data;
    },

    async findOne(filter) {
        let query = supabase.from(TABLE).select('*');

        for (const [key, value] of Object.entries(filter)) {
            const dbKey = key === 'isActive' ? 'is_active' : key;
            query = query.eq(dbKey, value);
        }

        const { data, error } = await query.maybeSingle();
        if (error) throw error;
        return data;
    },

    async findById(id) {
        const { data, error } = await supabase
            .from(TABLE)
            .select('id, username, email, name, role, is_active, last_login, created_at')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    async comparePassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    },

    async updateLastLogin(id) {
        const { error } = await supabase
            .from(TABLE)
            .update({ last_login: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    }
};

module.exports = User;
