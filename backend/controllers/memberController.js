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

        await db.query(`
            INSERT INTO Activity_History (club_id, user_id, action, description)
            VALUES ($1, $2, $3, $4)
        `, [club_id, req.user.id, 'Added Member', `Added ${full_name} to the club roster.`]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteMember = async (req, res) => {
    try {
        const club_id = req.user.club_id;
        const { id } = req.params;
        const memberCheck = await db.query(`SELECT full_name FROM Members WHERE id = $1 AND club_id = $2`, [id, club_id]);
        if (memberCheck.rows.length === 0) return res.status(404).json({ error: 'Member not found' });

        await db.query(`DELETE FROM Member_Honors WHERE member_id = $1`, [id]);
        await db.query(`DELETE FROM Members WHERE id = $1 AND club_id = $2`, [id, club_id]);

        await db.query(`
            INSERT INTO Activity_History (club_id, user_id, action, description)
            VALUES ($1, $2, $3, $4)
        `, [club_id, req.user.id, 'Deleted Member', `Deleted ${memberCheck.rows[0].full_name} from the roster.`]);

        res.json({ message: 'Member deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.bulkDeleteMembers = async (req, res) => {
    try {
        const club_id = req.user.club_id;
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'No IDs provided' });
        }

        // Get names for logging before deleting
        const membersData = await db.query(`SELECT id, full_name FROM Members WHERE id = ANY($1::uuid[]) AND club_id = $2`, [ids, club_id]);
        const validIds = membersData.rows.map(m => m.id);
        const validNames = membersData.rows.map(m => m.full_name).join(', ');

        if (validIds.length === 0) return res.status(404).json({ error: 'No valid members found to delete' });

        await db.query(`DELETE FROM Member_Honors WHERE member_id = ANY($1::uuid[])`, [validIds]);
        await db.query(`DELETE FROM Members WHERE id = ANY($1::uuid[]) AND club_id = $2`, [validIds, club_id]);

        await db.query(`
            INSERT INTO Activity_History (club_id, user_id, action, description)
            VALUES ($1, $2, $3, $4)
        `, [club_id, req.user.id, 'Bulk Deleted Members', `Deleted ${validIds.length} members from the roster.`]);

        res.json({ message: 'Members deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateMember = async (req, res) => {
    try {
        const club_id = req.user.club_id;
        const { id } = req.params;
        const { full_name, gender, class_level, role, year_joined, age, instructor_rank } = req.body;

        const result = await db.query(`
            UPDATE Members 
            SET full_name = $1, gender = $2, class_level = $3, role = $4, year_joined = $5, age = $6, instructor_rank = $7
            WHERE id = $8 AND club_id = $9 RETURNING *
        `, [
            full_name, gender, class_level, role,
            parseInt(year_joined || new Date().getFullYear()),
            parseInt(age || 10), instructor_rank || null,
            id, club_id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Member not found or not in your club' });
        }

        await db.query(`
            INSERT INTO Activity_History (club_id, user_id, action, description)
            VALUES ($1, $2, $3, $4)
        `, [club_id, req.user.id, 'Updated Member', `Updated member profile for ${full_name}`]);

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllMembers = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT m.*, c.club_name, ch.church_name 
            FROM Members m 
            JOIN Clubs c ON m.club_id = c.id
            LEFT JOIN Churches ch ON c.church_id = ch.id
            ORDER BY c.club_name, m.full_name
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
