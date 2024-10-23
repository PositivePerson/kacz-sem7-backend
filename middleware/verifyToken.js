const jwt = require('jsonwebtoken');

// Helper function to parse cookies
const parseCookies = (cookieHeader) => {
    const cookies = {};
    cookieHeader && cookieHeader.split(';').forEach((cookie) => {
        const parts = cookie.split('=');
        cookies[parts[0].trim()] = (parts[1] || '').trim();
    });
    return cookies;
};

// Middleware to protect routes
const verifyToken = (req, res, next) => {
    // Manually parse cookies from the 'cookie' header
    const cookies = parseCookies(req.headers.cookie);
    console.log("Parsed Cookies:", cookies);

    const token = cookies.authToken;  // Get the authToken from parsed cookies
    if (!token) {
        return res.status(401).json("Access denied, no token provided");
    }

    try {
        // Verify the token using JWT secret
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;  // Attach decoded token to request
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(400).json("Invalid token");
    }
};

module.exports = verifyToken;
