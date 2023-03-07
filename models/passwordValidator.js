const passwordValidator = require("password-validator");

// Créer un nouveau schéma de validation de mot de passe
const VerifySchema = new passwordValidator();

// Ajouter des règles de validation au schéma
VerifySchema
.is().min(6)
.is().max(20)
// Doit contenir au moins une majuscule
.has().uppercase(1)
.has().not().spaces(); 

module.exports = VerifySchema;
