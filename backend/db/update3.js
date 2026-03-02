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
            ALTER TABLE Clubs 
            ADD COLUMN IF NOT EXISTS address TEXT, 
            ADD COLUMN IF NOT EXISTS district VARCHAR(255), 
            ADD COLUMN IF NOT EXISTS federation VARCHAR(255), 
            ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255), 
            ADD COLUMN IF NOT EXISTS church_pastor VARCHAR(255), 
            ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50);
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS Notifications (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                sender_id UUID REFERENCES Users(id),
                receiver_id UUID REFERENCES Users(id),
                title VARCHAR(255),
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_read BOOLEAN DEFAULT FALSE
            );
        `);
        console.log("Database updated successfully.");
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

run();
