//importe le module http qui permet de  créer des serveurs web, d'envoyer des requêtes HTTP et de gérer des connexions réseau
const http = require("http");

// Importer l'application Express
const app = require("./app");
//configure le port 3000 comme port sur lequel le serveur va écouter
const port = process.env.PORT || 3000;
app.set("port", port);

const cors = require("cors");
// Applique le middleware CORS à l'application
app.use(cors());

//Créer un serveur HTTP en utilisant le module http de Node.js  en lui passant l'objet app créé à l'aide du framework Express
const server = http.createServer(app);
// Ecouter le port
server.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
// Gestion des erreurs
server.on("error", (error) => {
    //Vérifie si l'erreur n'est pas liée à la méthode "listen" de l'objet serveur
    if (error.syscall !== "listen") {
        // si l'erreur n'est pas liée à listen, cela signifie que c'est une erreur inattendue qui n'est pas liée au serveur lui-même. Dans ce cas, l'erreur est levée pour que le programme s'arrête et que l'utilisateur puisse identifier l'origine de l'erreur et la traiter correctement.
        throw error;
    } else {
        //Obtient l'adresse du serveur
        const address = server.address();
        //  Si l'address est une chaîne de caractères, cela signifie que le serveur écoute sur un canal nommé (pipe), donc la valeur de bind sera "pipe " suivi de la valeur de address. Sinon, cela signifie que le serveur écoute sur un port, donc la valeur de bind sera "port " suivi de la valeur de port.
        const bind =
            typeof address === "string" ? "pipe " + address : "port " + port;
        // Le serveur nécessite des privilèges élevés
        if (error.code === "EACCES") {
            //Affiche un message d'erreur indiquant que des privilèges élevés sont nécessaires
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            // L'adresse est déjà utilisée
        } else if (error.code === "EADDRINUSE") {
            // Affiche un message d'erreur indiquant que l'adresse est déjà utilisée
            console.error(`${bind} is already in use`);
            process.exit(1);
        } else {
            // Lève une erreur pour tout autre code d'erreur
            throw error;
        }
    }
});
