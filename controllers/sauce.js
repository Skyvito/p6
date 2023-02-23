const Thing = require("../models/Things");
const fs = require("fs");

exports.getAllThing = (req, res, next) => {
    Thing.find()
        .then((things) => res.status(200).json(things))
        .catch((error) => res.status(400).json(error));
};
