const rateLimit = require("express-rate-limit");

// Limiter for global requests (100 requests per minute from one IP)
const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Zbyt wiele żądań z tego IP, spróbuj ponownie za chwilę.",
    headers: true,
    handler: (req, res, next) => {
        // Customize response for rate limit exceeded
        res.status(429).json({
            error: true,
            message: "Zbyt wiele żądań z tego IP, spróbuj ponownie za chwilę."
        });
    }
});

// Limiter for sensitive endpoints (5 login attempts per 15 minutes)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit to 5 requests per windowMs
    message: "Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut.",
    headers: true,
    handler: (req, res, next) => {
        // Customize response for rate limit exceeded
        res.status(429).json({
            error: true,
            message: "Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut."
        });
    }
});

module.exports = { generalLimiter, authLimiter };
