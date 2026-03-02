const db = require('../db');
const bcrypt = require('bcrypt');

exports.getUsers = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT u.id, u.name, u.email, u.role, u.last_login, c.club_name 
            FROM Users u
            LEFT JOIN Clubs c ON u.club_id = c.id
            ORDER BY u.role, u.name
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addUser = async (req, res) => {
    try {
        const { name, email, password, role, club_name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query('BEGIN');

        let club_id = null;
        if (role === 'director' && club_name) {
            // Check if club already exists
            let clubRes = await db.query('SELECT id FROM Clubs WHERE club_name = $1', [club_name]);
            if (clubRes.rows.length === 0) {
                // For simplicity we create it under a default church or without Church link for now, or just name
                clubRes = await db.query('INSERT INTO Clubs (club_name) VALUES ($1) RETURNING id', [club_name]);
            }
            club_id = clubRes.rows[0].id;
        }

        const result = await db.query(`
            INSERT INTO Users (name, email, password, role, club_id) 
            VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role
        `, [name, email, hashedPassword, role, club_id]);

        const newUserId = result.rows[0].id;

        if (club_id) {
            await db.query('UPDATE Clubs SET director_id = $1 WHERE id = $2', [newUserId, club_id]);
        }

        await db.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(`UPDATE Clubs SET director_id = NULL WHERE director_id = $1`, [id]);
        await db.query(`DELETE FROM Users WHERE id = $1`, [id]);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query(`UPDATE Users SET password = $1 WHERE id = $2`, [hashedPassword, id]);

        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
