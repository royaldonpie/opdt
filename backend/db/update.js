const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    password: 'admin',
    port: 5432,
    host: 'localhost',
    database: 'opdt'
});

async function run() {
    await client.connect();
    try {
        await client.query(`ALTER TABLE Reports ADD COLUMN IF NOT EXISTS video_link TEXT;`);
        await client.query(`ALTER TABLE Exams DROP CONSTRAINT IF EXISTS exams_class_level_check;`);
        await client.query(`ALTER TABLE Exams ADD CONSTRAINT exams_class_level_check CHECK (class_level IN ('Friend', 'Companion', 'Explorer', 'Ranger', 'Voyager', 'Guide', 'General'));`);
        await client.query(`ALTER TABLE Reports DROP CONSTRAINT IF EXISTS reports_report_type_check;`);
        await client.query(`ALTER TABLE Reports ADD CONSTRAINT reports_report_type_check CHECK (report_type IN ('investiture', 'induction', 'enrollment', 'program', 'program report', 'evangelism/mission', 'camping'));`);
        console.log("Database constraints updated successfully.");
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

run();
