const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await db.query('SELECT Users.*, Clubs.club_name FROM Users LEFT JOIN Clubs ON Users.club_id = Clubs.id WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, club_id: user.club_id, club_name: user.club_name, name: user.name },
            process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '24h' }
        );

        // Update last log-in time
        await db.query('UPDATE Users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

        res.json({ token, user: { id: user.id, name: user.name, role: user.role, club_id: user.club_id, club_name: user.club_name } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.seedUsers = async (req, res) => {
    try {
        const pwd = await bcrypt.hash('password123', 10);

        // Ensure standard users exist for testing
        const check = await db.query("SELECT * FROM Users WHERE email = 'admin@opt.com'");
        if (check.rows.length === 0) {
            // Insert Admin
            await db.query(`
               INSERT INTO Users (name, email, password, role) 
               VALUES ('Super Admin', 'admin@opt.com', $1, 'super_admin')
           `, [pwd]);

            // Insert dummy Church
            const churchRes = await db.query(`
               INSERT INTO Churches (church_name, location)
               VALUES ('Babcock University Pioneer Church', 'Ilishan-Remo') RETURNING id
           `);
            const churchId = churchRes.rows[0].id;

            // Insert dummy Club
            const clubRes = await db.query(`
               INSERT INTO Clubs (club_name, church_id)
               VALUES ('Pioneer Elite Club', $1) RETURNING id
           `, [churchId]);
            const clubId = clubRes.rows[0].id;

            // Insert Director attached to club
            const directorRes = await db.query(`
               INSERT INTO Users (name, email, password, role, club_id) 
               VALUES ('Club Director', 'director@opt.com', $1, 'director', $2) RETURNING id
           `, [pwd, clubId]);

            // Update club with director ID
            await db.query(`UPDATE Clubs SET director_id = $1 WHERE id = $2`, [directorRes.rows[0].id, clubId]);

            // Insert Observer
            await db.query(`
               INSERT INTO Users (name, email, password, role) 
               VALUES ('Conference Leader', 'observer@opt.com', $1, 'observer')
           `, [pwd]);
        }
        res.json({ message: 'Users seeded successfully (password: password123)' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
