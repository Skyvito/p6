const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    // : j' utilise la fonction hash de bcrypt pour hasher le mot de passe fourni par l'utilisateur
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            // je créé un nouvel objet User qui contient l'email fourni par l'utilisateur et le mot de passe hashé généré par la fonction bcrypt.hash.
            const user = new User({
                email: req.body.email,
                password: hash,
            });

            // Sauvegarde de l'utilisateur dans la base de données
            user.save()

                .then(() =>
                    res.status(201).json({ message: "Utilisateur créé !" })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
