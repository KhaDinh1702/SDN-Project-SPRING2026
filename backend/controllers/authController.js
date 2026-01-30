const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const customerRole = await Role.findOne({ name: 'Customer' });
        const { password, ...rest } = req.body;
        const password_hash = await bcrypt.hash(password, 10);
        const user = await User.create({
            ...rest,
            password_hash,
            role_id: customerRole?._id 
        });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

        const matched = await bcrypt.compare(password, user.password_hash);
        if (!matched) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const payload = { id: user._id, role: user.role_id };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '7d' });

        res.json({ success: true, token, data: { id: user._id, email: user.email, first_name: user.first_name, last_name: user.last_name, role_id: user.role_id } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { register, login };