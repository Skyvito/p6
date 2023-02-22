//J'importe express
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");

//je me connecte a une base de donnée mongoDB useNewUrlParser  est utilisé pour analyser correctement les URL de connexion MongoDB et useUnifiedTopology pour s'assurer que les mises à jour du pilote de MongoDB sont prises en compte

mongoose
    .connect(
        "mongodb+srv://vito:wS3eL7MB8D6WCR8g@cluster0.uttmyvh.mongodb.net/?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

// Je créer l'application web
const app = express();

//permet à un client d'effectuer des requêtes depuis un nom de domaine différent de celui où l'API est hébergée.En utilisant différentes méthodes HTTP telles que GET, POST, PUT, DELETE, PATCH et OPTIONS.
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});
// permet à l'application Express de comprendre les données JSON envoyées dans les requêtes POST, PUT et PATCH.
app.use(express.json());

//J'exporte
module.exports = app;
