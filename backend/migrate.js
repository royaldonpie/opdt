const { Client } = require('pg');
const client = new Client({ user: 'postgres', password: 'admin', database: 'opdt', port: 5432 });
client.connect().then(() => {
    return client.query(`CREATE TABLE IF NOT EXISTS Resources(
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
        title VARCHAR(255) NOT NULL, 
        description TEXT, 
        type VARCHAR(50) CHECK (type IN ('pdf', 'link')) NOT NULL, 
        file_url TEXT NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
}).then(() => {
    console.log('Migrated!');
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
