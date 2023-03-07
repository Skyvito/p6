//J'importe express
const express = require("express");
const mongoose = require("mongoose");

const path = require("path");
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

//useNewUrlParser  est utilisé pour analyser correctement les URL de connexion MongoDB et useUnifiedTopology pour s'assurer que les mises à jour du pilote de MongoDB sont prises en compte

mongoose
    .connect(
        "mongodb+srv://vito:wS3eL7MB8D6WCR8g@cluster0.uttmyvh.mongodb.net/mydatabase?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        console.log("Connexion à MongoDB réussie !");
    })
    .catch(() => console.log("Connexion à MongoDB échouée !"));

// Je créer l'application web
const app = express();
//pour autoriser les requêtes de toutes les origines :

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

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
//J'exporte
module.exports = app;
