const rateLimit = require("express-rate-limit");

// Limiter dla globalnych żądań (ograniczenie 100 żądań na minutę z jednego IP)
export const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuta
    max: 100, // Limit 100 żądań na minutę
    message: "Zbyt wiele żądań z tego IP, spróbuj ponownie za chwilę.",
    headers: true,
});

// Limiter dla endpointów wrażliwych na brute-force (np. logowanie)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minut
    max: 5, // Limit 5 prób na IP na 15 minut
    message: "Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut.",
    headers: true,
});
