CREATE DATABASE IF NOT EXISTS disdukcapil;
USE disdukcapil;

CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user: admin / admin123
INSERT INTO admin_users (username, password) VALUES ('admin', 'admin123') ON DUPLICATE KEY UPDATE username='admin';

CREATE TABLE IF NOT EXISTS perekaman (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE,
    kecamatan VARCHAR(100) NOT NULL,
    no_hp VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'Lengkap',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pengaduan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    no_register VARCHAR(50) NOT NULL,
    coklat_pm VARCHAR(100),
    tanggal DATE NOT NULL,
    isi_pengaduan TEXT NOT NULL,
    tindak_lanjut TEXT,
    tanggal_selesai DATE,
    waktu VARCHAR(50),  -- Contoh: 1hari, 2hari
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ganti_foto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    kecamatan VARCHAR(100) NOT NULL,
    no_hp VARCHAR(20) NOT NULL,
    fc_kk BOOLEAN DEFAULT FALSE,
    ktp BOOLEAN DEFAULT FALSE,
    form BOOLEAN DEFAULT FALSE,
    aksi VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
