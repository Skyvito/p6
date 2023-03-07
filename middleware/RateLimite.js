const rateLimit = require("express-rate-limit");

// limiter le nombre de requêtes à 10 par heure
const loginRateLimit = rateLimit({
    windowMs: 3600000, // 1 heure en millisecondes
    max: 10,
    message: "Trop de tentatives de connexion. Veuillez réessayer plus tard.",
});
