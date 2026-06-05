require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        await pool.query("ALTER TABLE perekaman ADD COLUMN tempat_lahir VARCHAR(100) NULL AFTER nama");
        console.log("Added tempat_lahir");
    } catch (e) { console.log("tempat_lahir might already exist: " + e.message); }

    try {
        await pool.query("ALTER TABLE perekaman ADD COLUMN tanggal_lahir DATE NULL AFTER tempat_lahir");
        console.log("Added tanggal_lahir");
    } catch (e) { console.log("tanggal_lahir might already exist: " + e.message); }

    try {
        await pool.query("ALTER TABLE perekaman ADD COLUMN status VARCHAR(50) DEFAULT 'Lengkap' AFTER no_hp");
        console.log("Added status");
    } catch (e) { console.log("status might already exist: " + e.message); }
    
    process.exit(0);
}

migrate();
