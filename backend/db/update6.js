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
            CREATE TABLE IF NOT EXISTS Resources (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                type VARCHAR(50) CHECK (type IN ('pdf', 'link')) NOT NULL,
                file_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Resources table created/verified successfully.");
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

run();
