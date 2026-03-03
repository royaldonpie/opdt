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
        await client.query(`
            CREATE TABLE IF NOT EXISTS Notifications (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                sender_id UUID REFERENCES Users(id),
                receiver_id UUID REFERENCES Users(id),
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Notifications table created.");

        // update Reports check constraint
        await client.query(`
            ALTER TABLE Reports DROP CONSTRAINT IF EXISTS reports_report_type_check;
        `);
        console.log("Dropped reports constraint");

        // allow file_url to be null for baptismal
        await client.query(`
            ALTER TABLE Reports ALTER COLUMN file_url DROP NOT NULL;
        `);
        console.log("Made file_url nullable");

        // add baptism_count if not exists
        await client.query(`
            ALTER TABLE Reports ADD COLUMN IF NOT EXISTS baptism_count INTEGER;
            ALTER TABLE Reports ADD COLUMN IF NOT EXISTS video_link VARCHAR(255);
        `);
        console.log("Added new columns to Reports");

        // Exams General support
        await client.query(`
            ALTER TABLE Exams DROP CONSTRAINT IF EXISTS exams_class_level_check;
        `);
        console.log("Dropped Exams class level constraint");

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

run();
