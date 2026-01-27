const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '104547372973-dqq8ismlf93uah0h68aks37eihnr4enf.apps.googleusercontent.com');

const register = async (req, res) => {
    try {
        // Prevent registration if email is already used by any user (normal or Google)
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            if (existingUser.googleId) {
                return res.status(400).json({ success: false, message: 'Email already registered with Google. Please use Google sign-in.' });
            } else {
                return res.status(400).json({ success: false, message: 'Email already registered. Please login with your password.' });
            }
        }
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
}

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

const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;
        
        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID || '104547372973-dqq8ismlf93uah0h68aks37eihnr4enf.apps.googleusercontent.com'
        });
        
        const payload = ticket.getPayload();
        const { email, given_name, family_name, sub: googleId } = payload;
        
        // Check if user exists
        let user = await User.findOne({ email });
        
        if (user && !user.googleId) {
            // Link Google account to existing user
            user.googleId = googleId;
            await user.save();
        }
        
        if (!user) {
            // Create new user if doesn't exist
            const customerRole = await Role.findOne({ name: 'Customer' });
            const username = email.split('@')[0];
            user = await User.create({
                email,
                username,
                first_name: given_name || '',
                last_name: family_name || '',
                password_hash: await bcrypt.hash(googleId, 10), // Use Google ID as password hash
                role_id: customerRole?._id,
                googleId // Store Google ID for future reference
            });
            // Nếu muốn ko tạo tài khoản mới bằng GG
            // return res.status(400).json({ success: false, message: 'No account found with this email. Please register first.' });

        }
        
        // Generate JWT token
        const jwtPayload = { id: user._id, role: user.role_id };
        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '7d' });
        
        res.json({ 
            success: true, 
            token, 
            data: { 
                id: user._id, 
                email: user.email, 
                first_name: user.first_name, 
                last_name: user.last_name, 
                role_id: user.role_id 
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { register, login, googleAuth };