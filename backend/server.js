require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const examRoutes = require('./routes/exams');
const reportRoutes = require('./routes/reports');
const dashboardRoutes = require('./routes/dashboards');
const userRoutes = require('./routes/users');
const memberRoutes = require('./routes/members');
const settingsRoutes = require('./routes/settings');
const notificationRoutes = require('./routes/notifications');
const resourceRoutes = require('./routes/resources');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboards', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/resources', resourceRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get(/.*/, (req, res) => res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    // Auto-seed dummy and admin users if database was just provisioned
    try {
        const db = require('./db');
        const bcrypt = require('bcrypt');

        // Before inserting logic, grab the Honors seed file if it exists
        const fs = require('fs');
        const seedPath = path.join(__dirname, 'db', 'seed.sql');
        if (fs.existsSync(seedPath)) {
            const seedSql = fs.readFileSync(seedPath, 'utf8');
            await db.query(seedSql);
            console.log('Honors seed ran.');
        }

        const check = await db.query("SELECT * FROM Users WHERE email = 'admin@opt.com'");
        if (check.rows.length === 0) {
            const pwd = await bcrypt.hash('password123', 10);
            await db.query(`
               INSERT INTO Users (name, email, password, role) 
               VALUES ('Super Admin', 'admin@opt.com', $1, 'super_admin')
            `, [pwd]);

            const churchRes = await db.query(`
               INSERT INTO Churches (church_name, location)
               VALUES ('Babcock University Pioneer Church', 'Ilishan-Remo') RETURNING id
            `);
            const churchId = churchRes.rows[0].id;

            const clubRes = await db.query(`
               INSERT INTO Clubs (club_name, church_id)
               VALUES ('Pioneer Elite Club', $1) RETURNING id
            `, [churchId]);
            const clubId = clubRes.rows[0].id;

            const directorRes = await db.query(`
               INSERT INTO Users (name, email, password, role, club_id) 
               VALUES ('Club Director', 'director@opt.com', $1, 'director', $2) RETURNING id
            `, [pwd, clubId]);

            await db.query(`UPDATE Clubs SET director_id = $1 WHERE id = $2`, [directorRes.rows[0].id, clubId]);

            await db.query(`
               INSERT INTO Users (name, email, password, role) 
               VALUES ('Conference Leader', 'observer@opt.com', $1, 'observer')
            `, [pwd]);
            console.log('Database seeded with default testing accounts (password: password123).');
        }
    } catch (err) {
        console.error('Initial DB Seeding error:', err.message);
    }
});
