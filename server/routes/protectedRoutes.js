const express = require("express");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/dashboard", authenticate, (req, res) => {
    res.json({ message: "Welcome to the dashboard", user: req.user });
});

module.exports = router;
// 