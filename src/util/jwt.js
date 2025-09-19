const jwt = require("jsonwebtoken");
const { logger } = require("./logger");

const secretKey = "mySuperDuperSecretKeyForTesting";

function generateToken(user) {
    return jwt.sign(
        { user_id: user.user_id, username: user.username, role: user.role },
        secretKey,
        { expiresIn: "6h" }
    );
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Access denied: no token provided" });

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        logger.error(err);
        res.status(403).json({ message: "Invalid token" });
    }
}

module.exports = { generateToken, authenticateToken };
