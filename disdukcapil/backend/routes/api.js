const express = require('express');
const router = express.Router();
const db = require('../config/db');

// --- AUTH / DASHBOARD ---
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [rows] = await db.query('SELECT * FROM admin_users WHERE username = ? AND password = ?', [username, password]);
        if (rows.length > 0) {
            res.json({ success: true, message: 'Login berhasil' });
        } else {
            res.status(401).json({ success: false, message: 'Username atau password salah' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/dashboard-stats', async (req, res) => {
    try {
        const [perekaman] = await db.query('SELECT COUNT(*) as count FROM perekaman');
        const [pengaduan] = await db.query('SELECT COUNT(*) as count FROM pengaduan');
        const [ganti_foto] = await db.query('SELECT COUNT(*) as count FROM ganti_foto');
        res.json({
            perekaman: perekaman[0].count,
            pengaduan: pengaduan[0].count,
            ganti_foto: ganti_foto[0].count
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- PEREKAMAN KTP ---
router.get('/perekaman', async (req, res) => {
    try {
        // Automatically update 'Belum Lengkap / Perbaikan' to 'Perbaikan KK' if older than 24 hours
        await db.query(`
            UPDATE perekaman 
            SET status = 'Perbaikan KK' 
            WHERE status = 'Belum Lengkap / Perbaikan' 
            AND created_at <= NOW() - INTERVAL 1 DAY
        `);

        const [rows] = await db.query('SELECT * FROM perekaman ORDER BY id DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/perekaman', async (req, res) => {
    try {
        const { nama, tempat_lahir, tanggal_lahir, kecamatan, no_hp, status } = req.body;
        const newStatus = status || 'Lengkap';
        await db.query('INSERT INTO perekaman (nama, tempat_lahir, tanggal_lahir, kecamatan, no_hp, status) VALUES (?, ?, ?, ?, ?, ?)', [nama, tempat_lahir || null, tanggal_lahir || null, kecamatan, no_hp, newStatus]);
        res.json({ success: true, message: 'Data perekaman berhasil ditambahkan' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/perekaman/:id', async (req, res) => {
    try {
        const { nama, tempat_lahir, tanggal_lahir, kecamatan, no_hp, status } = req.body;
        await db.query('UPDATE perekaman SET nama=?, tempat_lahir=?, tanggal_lahir=?, kecamatan=?, no_hp=?, status=? WHERE id=?', [nama, tempat_lahir || null, tanggal_lahir || null, kecamatan, no_hp, status, req.params.id]);
        res.json({ success: true, message: 'Data perekaman berhasil diupdate' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/perekaman/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM perekaman WHERE id=?', [req.params.id]);
        res.json({ success: true, message: 'Data perekaman berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- PENGADUAN HARIAN ---
router.get('/pengaduan', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pengaduan ORDER BY id DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/pengaduan', async (req, res) => {
    try {
        const { nama, no_register, coklat_pm, tanggal, isi_pengaduan, tindak_lanjut, tanggal_selesai, waktu } = req.body;
        await db.query(
            'INSERT INTO pengaduan (nama, no_register, coklat_pm, tanggal, isi_pengaduan, tindak_lanjut, tanggal_selesai, waktu) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [nama, no_register, coklat_pm, tanggal, isi_pengaduan, tindak_lanjut, tanggal_selesai, waktu]
        );
        res.json({ success: true, message: 'Data pengaduan berhasil ditambahkan' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/pengaduan/:id', async (req, res) => {
    try {
        const { nama, no_register, coklat_pm, tanggal, isi_pengaduan, tindak_lanjut, tanggal_selesai, waktu } = req.body;
        await db.query(
            'UPDATE pengaduan SET nama=?, no_register=?, coklat_pm=?, tanggal=?, isi_pengaduan=?, tindak_lanjut=?, tanggal_selesai=?, waktu=? WHERE id=?', 
            [nama, no_register, coklat_pm, tanggal, isi_pengaduan, tindak_lanjut, tanggal_selesai, waktu, req.params.id]
        );
        res.json({ success: true, message: 'Data pengaduan berhasil diupdate' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/pengaduan/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM pengaduan WHERE id=?', [req.params.id]);
        res.json({ success: true, message: 'Data pengaduan berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- GANTI FOTO KTP ---
router.get('/ganti-foto', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ganti_foto ORDER BY id DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/ganti-foto', async (req, res) => {
    try {
        const { nama, kecamatan, no_hp, fc_kk, ktp, form, aksi } = req.body;
        await db.query(
            'INSERT INTO ganti_foto (nama, kecamatan, no_hp, fc_kk, ktp, form, aksi) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [nama, kecamatan, no_hp, fc_kk ? 1 : 0, ktp ? 1 : 0, form ? 1 : 0, aksi]
        );
        res.json({ success: true, message: 'Data ganti foto berhasil ditambahkan' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/ganti-foto/:id', async (req, res) => {
    try {
        const { nama, kecamatan, no_hp, fc_kk, ktp, form, aksi } = req.body;
        await db.query(
            'UPDATE ganti_foto SET nama=?, kecamatan=?, no_hp=?, fc_kk=?, ktp=?, form=?, aksi=? WHERE id=?', 
            [nama, kecamatan, no_hp, fc_kk ? 1 : 0, ktp ? 1 : 0, form ? 1 : 0, aksi, req.params.id]
        );
        res.json({ success: true, message: 'Data ganti foto berhasil diupdate' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/ganti-foto/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM ganti_foto WHERE id=?', [req.params.id]);
        res.json({ success: true, message: 'Data ganti foto berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
