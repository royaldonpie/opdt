const db = require('../db');

exports.getAdminDashboard = async (req, res) => {
    try {
        const clubsCount = await db.query('SELECT COUNT(*) FROM Clubs');
        const pathfindersCount = await db.query(`SELECT COUNT(*) FROM Members WHERE role = 'pathfinder'`);
        const instructorsCount = await db.query(`SELECT COUNT(*) FROM Members WHERE role = 'instructor'`);
        const pendingExams = await db.query(`SELECT COUNT(*) FROM Exams WHERE status = 'pending'`);
        const approvedExams = await db.query(`SELECT COUNT(*) FROM Exams WHERE status = 'approved'`);

        // Reports this month
        const reportsThisMonth = await db.query(`
            SELECT COUNT(*) FROM Reports 
            WHERE EXTRACT(MONTH FROM date_submitted) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM date_submitted) = EXTRACT(YEAR FROM CURRENT_DATE)
        `);

        // Honor Distribution logic
        const honorDistribution = await db.query(`
            SELECT h.honor_name, COUNT(mh.id) as total_awarded
            FROM Honors h
            LEFT JOIN Member_Honors mh ON h.id = mh.honor_id
            GROUP BY h.id
            ORDER BY total_awarded DESC
            LIMIT 5
        `);

        res.json({
            totalClubs: parseInt(clubsCount.rows[0].count),
            totalPathfinders: parseInt(pathfindersCount.rows[0].count),
            totalInstructors: parseInt(instructorsCount.rows[0].count),
            pendingExams: parseInt(pendingExams.rows[0].count),
            approvedExams: parseInt(approvedExams.rows[0].count),
            reportsThisMonth: parseInt(reportsThisMonth.rows[0].count),
            honorDistribution: honorDistribution.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDirectorDashboard = async (req, res) => {
    try {
        const club_id = req.user.club_id;

        const pathfindersCount = await db.query(`SELECT COUNT(*) FROM Members WHERE role = 'pathfinder' AND club_id = $1`, [club_id]);
        const instructorsCount = await db.query(`SELECT COUNT(*) FROM Members WHERE role = 'instructor' AND club_id = $1`, [club_id]);
        const pendingExams = await db.query(`SELECT COUNT(*) FROM Exams WHERE status = 'pending' AND club_id = $1`, [club_id]);
        const approvedExams = await db.query(`SELECT COUNT(*) FROM Exams WHERE status = 'approved' AND club_id = $1`, [club_id]);
        const reportsSubmitted = await db.query(`SELECT COUNT(*) FROM Reports WHERE club_id = $1`, [club_id]);

        res.json({
            totalMembers: parseInt(pathfindersCount.rows[0].count) + parseInt(instructorsCount.rows[0].count),
            pathfinders: parseInt(pathfindersCount.rows[0].count),
            instructors: parseInt(instructorsCount.rows[0].count),
            pendingExams: parseInt(pendingExams.rows[0].count),
            approvedExams: parseInt(approvedExams.rows[0].count),
            reportsSubmitted: parseInt(reportsSubmitted.rows[0].count)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getObserverDashboard = async (req, res) => {
    try {
        const clubsCount = await db.query('SELECT COUNT(*) FROM Clubs');
        const totalMembers = await db.query('SELECT COUNT(*) FROM Members');
        const approvedExams = await db.query(`SELECT COUNT(*) FROM Exams WHERE status = 'approved'`);

        const clubsData = await db.query(`
            SELECT c.id, c.club_name, COUNT(m.id) as population
            FROM Clubs c
            LEFT JOIN Members m ON c.id = m.club_id
            GROUP BY c.id, c.club_name
            ORDER BY population DESC
        `);

        res.json({
            totalClubs: parseInt(clubsCount.rows[0].count),
            totalMembers: parseInt(totalMembers.rows[0].count),
            approvedExams: parseInt(approvedExams.rows[0].count),
            clubsData: clubsData.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
