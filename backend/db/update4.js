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
            ALTER TABLE Clubs RENAME COLUMN contact_person TO pathfinder_director;
        `);
        console.log("Renamed contact_person to pathfinder_director");
    } catch(e) {
        console.log("Rename might have failed or already done", e.message);
    }
    
    try {
        await client.query(`
            ALTER TABLE Clubs ADD COLUMN IF NOT EXISTS pastor_phone_number VARCHAR(50);
        `);
        console.log("Added pastor_phone_number column");
        console.log("Database updated successfully.");
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

run();
