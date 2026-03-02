const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    console.log("Connecting securely to PostgreSQL server...");

    // First, connect to default database to create the new one
    const initialClient = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'admin',
        port: 5432,
    });

    try {
        await initialClient.connect();

        // We do a manual check so it won't throw if it already exists
        const checkDb = await initialClient.query(`SELECT datname FROM pg_database WHERE datname = 'opdt'`);
        if (checkDb.rows.length === 0) {
            console.log("Creating database opdt...");
            await initialClient.query("CREATE DATABASE opdt;");
            console.log("Database 'opdt' created successfully!");
        } else {
            console.log("Database 'opdt' already exists.");
        }
    } catch (e) {
        console.error("Error creating database:", e.message);
        return; // Halt if we couldn't even connect to the main Postgres instance
    } finally {
        await initialClient.end();
    }

    console.log("Connecting to the opdt database to provision tables...");

    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'opdt',
        password: 'admin',
        port: 5432,
    });

    try {
        await client.connect();

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        console.log("Running schema.sql...");
        await client.query(schemaSql);

        const seedPath = path.join(__dirname, 'seed.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        console.log("Running seed.sql...");
        await client.query(seedSql);

        console.log("Database provisioned successfully! You are ready to go!");
    } catch (e) {
        console.error("Error running scripts inside opdt schema:", e.message);
    } finally {
        await client.end();
    }
}

setupDatabase();
