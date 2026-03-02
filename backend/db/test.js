const { Client } = require('pg');

async function test() {
    const c = new Client({
        user: 'postgres',
        password: 'postgres',
        port: 5432,
        host: 'localhost',
        database: 'postgres'
    });

    try {
        await c.connect();
        console.log('PostgreSQL connection successful');
        await c.end();
    } catch (e) {
        console.error('Connection failed:', e.message);
    }
}

test();
