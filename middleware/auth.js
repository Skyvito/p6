const jwt = require("jsonwebtoken");
// je récupère le token d'authentification stocké dans l'en-tête "Authorization" de la requête et je vérifie la validité du token en le décodant à l'aide de la clé secrète. Si le token est valide, le middleware extrait l'ID de l'utilisateur à partir du token décodé et le stocke dans l'objet de requête req.auth pour que les routes suivantes puissent l'utiliser. 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId,
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
