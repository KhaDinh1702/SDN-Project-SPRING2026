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
const crypto = require("crypto");

async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  // Try to load a User model if your backend uses one (Mongoose example)
  let User;
  try {
    User = require("../models/User");
  } catch (e) {
    User = null;
  }

  try {
    if (User) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        // generate token + expiry
        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();

        // TODO: send email containing reset link to user
        // Example reset link: `${process.env.CLIENT_URL}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`
        // For now we log the token so you can verify flow during dev:
        console.log("Password reset token for", user.email, token);
      }
      // SECURITY: always return 200 to avoid revealing whether email exists
      return res.json({ message: "If that email exists, instructions were sent." });
    } else {
      // No User model detected — fallback behavior: don't reveal info
      console.log("Forgot password requested for:", email);
      return res.json({ message: "If that email exists, instructions were sent." });
    }
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { register, login, googleAuth, forgotPassword };