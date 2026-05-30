require('dotenv').config({ path: './backend/.env' });
const mysql = require('mysql2/promise');

async function migrate() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        await pool.query("ALTER TABLE perekaman ADD COLUMN tempat_lahir VARCHAR(100) NULL AFTER nama");
        console.log("Added tempat_lahir");
    } catch (e) { console.error(e.message); }

    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        await pool.query("ALTER TABLE perekaman ADD COLUMN tanggal_lahir DATE NULL AFTER tempat_lahir");
        console.log("Added tanggal_lahir");
    } catch (e) { console.error(e.message); }
    
    process.exit(0);
}

migrate();
