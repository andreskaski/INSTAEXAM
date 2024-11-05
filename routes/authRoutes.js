// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
    const { email, password, name, school, schoolLevel, country, city } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            school,
            schoolLevel,
            country,
            city
        });
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(400).json({ error: "Error en el registro" });
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(403).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
});

module.exports = router;
