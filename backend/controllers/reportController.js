const db = require('../db');

exports.submitReport = async (req, res) => {
    try {
        const { report_type, video_link, baptism_count } = req.body;
        const file_url = req.file ? `/uploads/${req.file.filename}` : null;
        const club_id = req.user.club_id; // from JWT token after Director login

        if (report_type !== 'baptism' && !file_url) {
            return res.status(400).json({ error: 'Valid support file is required.' });
        }
        if (report_type === 'baptism' && (baptism_count === undefined || baptism_count === null)) {
            return res.status(400).json({ error: 'Baptism count is required.' });
        }
        if (!club_id) {
            return res.status(400).json({ error: 'Club ID missing' });
        }

        const result = await db.query(
            `INSERT INTO Reports (club_id, report_type, file_url, video_link, baptism_count) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [club_id, report_type, file_url, video_link || null, baptism_count || null]
        );

        res.status(201).json({ message: 'Report submitted successfully', report: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReports = async (req, res) => {
    try {
        let query = 'SELECT r.*, c.club_name FROM Reports r JOIN Clubs c ON r.club_id = c.id';
        let values = [];

        if (req.user.role === 'director') {
            query += ' WHERE r.club_id = $1';
            values.push(req.user.club_id);
        }

        query += ' ORDER BY r.date_submitted DESC';

        const result = await db.query(query, values);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { approved, admin_remark } = req.body;

        await db.query(`UPDATE Reports SET approved = $1, admin_remark = $2 WHERE id = $3`, [approved, admin_remark, id]);
        res.json({ message: 'Report status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
