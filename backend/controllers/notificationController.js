const db = require('../db');

exports.getNotifications = async (req, res) => {
    try {
        const user_id = req.user.id;
        // Super Admins don't strictly need to receive notifications from this logic unless desired, but Directors do.
        // We'll return notifications targeted to the user, OR to all (receiver_id is null).
        // Since super_admin sends them mostly.

        let query;
        let values;

        if (req.user.role === 'super_admin') {
            // Super Admin might want to see what they sent
            query = `SELECT n.*, u.name as receiver_name FROM Notifications n LEFT JOIN Users u ON n.receiver_id = u.id WHERE n.sender_id = $1 ORDER BY n.created_at DESC`;
            values = [user_id];
        } else {
            // Directors get messages for them specifically or broadcast (receiver_id IS NULL)
            query = `SELECT n.*, u.name as sender_name FROM Notifications n LEFT JOIN Users u ON n.sender_id = u.id WHERE n.receiver_id = $1 OR n.receiver_id IS NULL ORDER BY n.created_at DESC`;
            values = [user_id];
        }

        const result = await db.query(query, values);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.sendNotification = async (req, res) => {
    try {
        const { receiver_id, title, message } = req.body;
        const sender_id = req.user.id;

        // if receiver_id is "all" or empty, make it null for broadcast
        const finalReceiverId = (receiver_id === 'all' || !receiver_id) ? null : receiver_id;

        await db.query(
            `INSERT INTO Notifications (sender_id, receiver_id, title, message) VALUES ($1, $2, $3, $4)`,
            [sender_id, finalReceiverId, title, message]
        );

        res.status(201).json({ message: 'Push notification broadcast successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(`UPDATE Notifications SET is_read = TRUE WHERE id = $1 AND (receiver_id = $2 OR receiver_id IS NULL)`, [id, req.user.id]);
        res.json({ message: 'Marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
