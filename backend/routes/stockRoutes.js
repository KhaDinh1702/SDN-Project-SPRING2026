const express = require('express');
const router = express.Router();
//test GET /stock
router.get('/history', (req, res) => {
    res.json({ message: "Lịch sử kho hàng" });
});

module.exports = router;