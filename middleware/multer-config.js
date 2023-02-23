//Importation de la bibliothèque Multer
const multer = require("multer");
//les types d'images acceptées
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};
//méthode diskStorage() de Multer permet de spécifier l'emplacement de stockage et le nommage des fichiers. les fichiers sont stockés dans le dossier "images".
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension);
    },
});

module.exports = multer({ storage: storage }).single("image");
