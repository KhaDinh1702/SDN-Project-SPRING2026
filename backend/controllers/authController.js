const User = require('../models/User');
const Role = require('../models/Role');

const register = async (req, res) => {
    try {
        const customerRole = await Role.findOne({ name: 'Customer' });
        const user = await User.create({
            ...req.body,
            role_id: customerRole._id // Gán quyền Customer mặc định
        });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { register };