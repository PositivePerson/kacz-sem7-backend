const jwt = require('jsonwebtoken');

// Middleware to protect routes
const verifyToken = (req, res, next) => {
    // const token = req.header('Authorization')?.split(' ')[1]; // Expecting format "Bearer token"
    // Read the token from cookies (expecting token to be stored in "authToken" cookie)
    const token = req.cookies.authToken;  // Access the token from the "authToken" cookie

    if (!token) {
        return res.status(401).json("Access denied, no token provided");
    }

    try {
        // Verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET);  // Verify token with secret key
        req.user = verified;  // Attach the decoded user info to the request
        next();  // Proceed to the next middleware/route handler
    } catch (err) {
        res.status(400).json("Invalid token");  // Handle invalid token error
    }
};

module.exports = verifyToken;
