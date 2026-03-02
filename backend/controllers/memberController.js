const db = require('../db');

exports.getMembers = async (req, res) => {
    try {
        const club_id = req.user.club_id;
        const result = await db.query(`SELECT * FROM Members WHERE club_id = $1 ORDER BY role, full_name`, [club_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addMember = async (req, res) => {
    try {
        const club_id = req.user.club_id;
        const { full_name, gender, class_level, role, year_joined, age, instructor_rank } = req.body;

        const result = await db.query(`
            INSERT INTO Members (full_name, gender, class_level, role, club_id, year_joined, age, instructor_rank) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
        `, [
            full_name,
            gender,
            class_level,
            role,
            club_id,
            parseInt(year_joined || new Date().getFullYear()),
            parseInt(age || 10),
            instructor_rank || null
        ]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteMember = async (req, res) => {
    try {
        const club_id = req.user.club_id;
        const { id } = req.params;
        await db.query(`DELETE FROM Member_Honors WHERE member_id = $1`, [id]);
        await db.query(`DELETE FROM Members WHERE id = $1 AND club_id = $2`, [id, club_id]);
        res.json({ message: 'Member deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
