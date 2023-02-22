// J'importe mongoose
const mongoose = require("mongoose");
//j'utilise mongoose-unique-validator pour ajouter une validation unique au champ e-mail de l'utilisateur.
const uniqueValidator = require("mongoose-unique-validator");

//je  définit un schéma de données pour un utilisateur avec deux champs obligatoires: email et password. Le champ e-mail est également déclaré unique. Cela signifie que deux utilisateurs ne peuvent pas avoir le même e-mail.
const userSchema = mongoose.Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
});

// le plugin uniqueValidator est ajouté au schéma pour valider le champ unique e-mail
userSchema.plugin(uniqueValidator);
//j'exporte le modèle
module.exports = mongoose.model("User", userSchema);
