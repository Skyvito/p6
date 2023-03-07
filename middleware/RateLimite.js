const rateLimit = require("express-rate-limit");

// limiter le nombre de requêtes à 10 par heure  par utilisateur
const loginLimit = rateLimit({
    windowMs: 3600000, // 1 heure en millisecondes
    max: 10,
    message: "Trop de tentatives de connexion. Veuillez réessayer plus tard.",
    // Correction de mon problème faire 10 requêtes par adresse email et pas par ip
    keyGenerator: function (req) {
        return req.body.email;
    },
});

module.exports = loginLimit;
