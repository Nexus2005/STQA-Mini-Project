const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Helper to load env variables from .env.local or .env
const envPaths = [
  path.join(__dirname, '..', '.env.local'),
  path.join(__dirname, '..', '.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valParts] = trimmed.split('=');
        if (key && valParts.length > 0) {
          const val = valParts.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  ssl: process.env.DB_HOST && !process.env.DB_HOST.includes('localhost')
    ? { rejectUnauthorized: false }
    : undefined,
});

async function main() {
  console.log('Connecting to Supabase PostgreSQL database...');
  const client = await pool.connect();
  try {
    console.log('[+] Connected successfully to Supabase!');
    const versionRes = await client.query('SELECT version()');
    console.log('[+] DB Version:', versionRes.rows[0].version);

    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('[+] Applying schema.sql to Supabase...');
    await client.query(sql);
    console.log('[✓] All tables (users, comments, feedback, test_runs) created and seeded successfully!');

    // Test query tables
    const usersCount = await client.query('SELECT count(*) FROM users');
    const commentsCount = await client.query('SELECT count(*) FROM comments');
    const feedbackCount = await client.query('SELECT count(*) FROM feedback');

    console.log('--- Database Verification ---');
    console.log('Users in DB:    ', usersCount.rows[0].count);
    console.log('Comments in DB: ', commentsCount.rows[0].count);
    console.log('Feedback in DB: ', feedbackCount.rows[0].count);
    console.log('-----------------------------');
  } catch (err) {
    console.error('[-] Database setup error:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
