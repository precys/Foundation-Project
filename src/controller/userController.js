const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../service/userService");
const { generateToken } = require("../util/jwt");
const { logger } = require("../util/logger");



// register new user
router.post("/register", async (req, res) => {
    try {
        const user = await registerUser(req.body);
        if (!user) return res.status(400).json({ message: "Username is already taken" });

        const token = generateToken({
            user_id: user.user_id,
            username: user.username,
            role: user.role
        });

        res.status(201).json({ message: "Registration successful", token, role: user.role });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: "Registration failed" });
    }
});





// login existing user
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await loginUser(username, password);

        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const token = generateToken({
            user_id: user.user_id,
            username: user.username,
            role: user.role
        });

        res.status(200).json({ message: "Login successful", token, role: user.role });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: "Login failed" });
    }
});

module.exports = router;
