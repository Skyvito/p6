const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sanitize = require("mongo-sanitize");
const passwordSchema = require("../models/passwordValidator");
const validator = require("email-validator");

// Inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        return res.status(400).json({
            message:
                "Le mot de passe doit comporter entre 8 et 20 caractères et doit contenir au moins une majuscule et aucun espace.",
        });
    } else if (!validator.validate(req.body.email)) {
        return res.status(400).json({ error: "Adresse email invalide !" });
    }
    // : j' utilise la fonction hash de bcrypt pour hasher le mot de passe fourni par l'utilisateur
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            // je créé un nouvel objet User qui contient l'email fourni par l'utilisateur et le mot de passe hashé généré par la fonction bcrypt.hash.
            const user = new User({
                email: sanitize(req.body.email),
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

// Connexion d'un utilisateur existant
exports.login = (req, res, next) => {
    // Recherche de l'utilisateur correspondant à l'adresse email fournie
    User.findOne({ email: sanitize(req.body.email) })
        .then((user) => {
            // Si l'utilisateur n'est pas trouvé, renvoyer une erreur 401 Unauthorized
            if (!user) {
                return res
                    .status(401)
                    .json({ error: "Utilisateur non trouvé !" });
            }
            // Comparaison du mot de passe fourni avec le hash enregistré dans la base de données
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    // Si le mot de passe est incorrect, renvoyer une erreur 401 Unauthorized
                    if (!valid) {
                        return res
                            .status(401)
                            .json({ error: "Mot de passe incorrect !" });
                    }
                    // Génération d'un token JWT avec l'ID de l'utilisateur comme payload
                    const token = jwt.sign(
                        { userId: user._id },
                        "RANDOM_TOKEN_SECRET",
                        { expiresIn: "24h" }
                    );
                    // Envoi du token dans la réponse
                    res.status(200).json({
                        userId: user._id,
                        token: token,
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
