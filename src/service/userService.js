const userDAO = require("../repository/userDAO");
const bcrypt = require("bcrypt");
const { logger } = require("../util/logger");
const crypto = require("crypto");






// register new user
async function registerUser(user) {
    const existingUser = await userDAO.getUserByUsername(user.username);
    if (existingUser) {
        logger.info("Username is already taken");
        return null;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const validRoles = ["manager", "employee"];
    const role = validRoles.includes(user.role) ? user.role : "employee";

    const newUser = {
        user_id: crypto.randomUUID(),
        username: user.username,
        password: hashedPassword,
        role
    };

    try {
        return await userDAO.createUser(newUser);
    } catch (err) {
        logger.error("Failed to create user:", err);
        return null;
    }
}







// login user
async function loginUser(username, password) {
    const user = await userDAO.getUserByUsername(username);
    if (!user) return null;

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return null;

    return user;
}





module.exports = { registerUser, loginUser };
