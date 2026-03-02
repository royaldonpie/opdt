const db = require('../db');

exports.getClubSettings = async (req, res) => {
    try {
        if (!req.user.club_id) return res.status(404).json({ error: 'No club associated with this director.' });

        const result = await db.query(
            `SELECT club_name, address, district, federation, pathfinder_director, church_pastor, phone_number, pastor_phone_number 
             FROM Clubs WHERE id = $1`,
            [req.user.club_id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Club not found.' });

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateClubSettings = async (req, res) => {
    try {
        const { club_name, address, district, federation, pathfinder_director, church_pastor, phone_number, pastor_phone_number } = req.body;

        if (!req.user.club_id) return res.status(400).json({ error: 'Cannot update: No associated club.' });

        await db.query(`
            UPDATE Clubs
            SET club_name = $1, address = $2, district = $3, federation = $4, pathfinder_director = $5, church_pastor = $6, phone_number = $7, pastor_phone_number = $8
            WHERE id = $9
        `, [club_name, address, district, federation, pathfinder_director, church_pastor, phone_number, pastor_phone_number, req.user.club_id]);

        res.json({ message: 'Settings saved successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
