const Sauce = require("../models/Sauce");
const fs = require("fs");
const sanitize = require("mongo-sanitize");

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((things) => res.status(200).json(things))
        .catch((error) => res.status(400).json(error));
};

exports.createSauce = (req, res, next) => {
    if (!req.file) {
        return res
            .status(400)
            .json({ error: "Veuillez sélectionner une image" });
    }

    const sauceObject = JSON.parse(sanitize(req.body.sauce));
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: sanitize(req.auth.userId),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
    });

    sauce
        .save()
        .then(() => {
            res.status(201).json({ message: "Objet enregistré !" });
        })
        .catch((error) => {
            fs.unlink(`images/${req.file.filename}`, () => {
                res.status(400).json({ error });
            });
        });
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((Sauce) => res.status(200).json(Sauce))
        .catch((error) => res.status(404).json(error));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: "Objet supprimé !",
                            });
                        })
                        .catch((error) => res.status(403).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: sanitize(req.params.id) })
        .then((sauce) => {
            if (sauce) {
                if (sauce.userId != sanitize(req.auth.userId)) {
                    res.status(403).json({ message: "Not authorized" });
                } else {
                    const updatedSauce = req.file
                        ? {
                              ...JSON.parse(sanitize(req.body.sauce)),
                              imageUrl: `${req.protocol}://${req.get(
                                  "host"
                              )}/images/${req.file.filename}`,
                          }
                        : { ...sanitize(req.body) };

                    delete updatedSauce._userId;
                    if (req.file) {
                        // Supprimer l'ancienne image
                        const filename = sauce.imageUrl.split("/images/")[1];
                        fs.unlink(`images/${filename}`, () => {
                            console.log("Ancienne image supprimée !");
                        });
                    }
                    Sauce.updateOne(
                        { _id: sanitize(req.params.id) },
                        { ...updatedSauce, _id: sanitize(req.params.id) }
                    )
                        .then(() =>
                            res.status(200).json({ message: "Objet modifié!" })
                        )
                        .catch((error) => res.status(404).json({ error }));
                }
            } else {
                if (req.file) {
                    const noSaucefilename = req.file.filename;
                    fs.unlink(`images/${noSaucefilename}`, () => {
                        console.log("Image supprimée !");
                    });
                }
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.likeSauce = (req, res, next) => {
    const sauceId = sanitize(req.params.id);
    const userId = sanitize(req.auth.userId);
    const like = req.body.like;

    // Vérifier que like est bien -1, 0 ou 1
    if (like !== -1 && like !== 0 && like !== 1) {
        return res.status(400).json({ error: "Valeur de like invalide !" });
    }

    // Je vais chercher la Sauce
    Sauce.findOne({ _id: sauceId }).then((sauce) => {
        if (!sauce) {
            return res.status(404).json({ error: "Sauce non trouvée !" });
        }
        const userLiked = sauce.usersLiked.indexOf(userId);
        const userDisliked = sauce.usersDisliked.indexOf(userId);

        // Si l'utilisateur a déjà aimé la sauce
        switch (true) {
            // Si l'utilisateur a déjà aimé la sauce
            case userLiked !== -1:
                switch (like) {
                    case 1:
                        return res.status(200).json({
                            message: "Vous avez déjà aimé cette sauce !",
                        });
                    case 0:
                        sauce.likes--;
                        sauce.usersLiked.splice(userLiked, 1);
                        break;
                    default:
                        return res
                            .status(400)
                            .json({ error: "Valeur de like invalide !" });
                }
                break;

            // Si l'utilisateur a déjà disliké la sauce
            case userDisliked !== -1:
                switch (like) {
                    case -1:
                        return res.status(200).json({
                            message: "Vous avez déjà disliké cette sauce !",
                        });
                    case 0:
                        sauce.dislikes--;
                        sauce.usersDisliked.splice(userDisliked, 1);
                        break;
                    default:
                        return res
                            .status(400)
                            .json({ error: "Valeur de like invalide !" });
                }
                break;

            // Si l'utilisateur n'a jamais liké ou disliké la sauce
            default:
                switch (like) {
                    case 1:
                        sauce.likes++;
                        sauce.usersLiked.push(userId);
                        break;
                    case -1:
                        sauce.dislikes++;
                        sauce.usersDisliked.push(userId);
                        break;
                    case 0:
                        break;
                    default:
                        return res
                            .status(400)
                            .json({ error: "Valeur de like invalide !" });
                }
                break;
        }

        sauce
            .save()
            .then(() => {
                res.status(200).json({
                    message: "Votre avis a été enregistré !",
                });
            })
            .catch((error) => {
                res.status(500).json({ error });
            });
    });
};
