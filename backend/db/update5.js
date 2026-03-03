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
            CREATE TABLE IF NOT EXISTS Activity_History (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                club_id UUID REFERENCES Clubs(id),
                user_id UUID REFERENCES Users(id),
                action VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Activity_History table created successfully.");
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

run();
