const db = require('../db');

exports.addResource = async (req, res) => {
    try {
        const { title, description, type, link_url } = req.body;
        let file_url = '';

        if (type === 'pdf') {
            if (!req.file) {
                return res.status(400).json({ error: 'PDF file is required for type pdf.' });
            }
            file_url = `/uploads/${req.file.filename}`;
        } else if (type === 'link') {
            if (!link_url) {
                return res.status(400).json({ error: 'Link URL is required for type link.' });
            }
            file_url = link_url;
        } else {
            return res.status(400).json({ error: 'Type must be pdf or link.' });
        }

        const result = await db.query(
            `INSERT INTO Resources (title, description, type, file_url) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, description || null, type, file_url]
        );

        res.status(201).json({ message: 'Resource added successfully', resource: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getResources = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Resources ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(`DELETE FROM Resources WHERE id = $1`, [id]);
        res.json({ message: 'Resource deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
