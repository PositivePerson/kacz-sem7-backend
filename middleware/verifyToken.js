const jwt = require('jsonwebtoken');

// Middleware to protect routes
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Expecting format "Bearer token"
    if (!token) return res.status(401).json("Access denied, no token provided");

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);  // Verify token
        req.user = verified;  // Attach user data (from the token) to request
        next();  // Proceed to the next middleware/route handler
    } catch (err) {
        res.status(400).json("Invalid token");
    }
};

module.exports = verifyToken;
