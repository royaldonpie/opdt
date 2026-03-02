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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
