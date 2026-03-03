const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const poolConfig = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
} : {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'opdt',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 5432,
};

const pool = new Pool(poolConfig);

// Automatically initialize schema on connection
async function initDb() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('Database schema ensured.');
    }
  } catch (err) {
    console.error('Error initializing DB schema:', err);
  }
}

initDb();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
