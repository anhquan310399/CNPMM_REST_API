const jwt = require('jsonwebtoken')
const User = require('../models/user')
exports.authLogin = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({ _id: data._id, 'tokens.token': token })
            .then((user) => {
                if (!user) {
                    return res.status(401).send({
                        message: "Please login"
                    });
                }
                req.user = user;
                next();
            })
            .catch((err) => {
                return res.status(401).send({
                    message: "Not authorized to access this resource",
                });
            });
    } catch (error) {
        res.status(401).send({ message: 'Not authorized to access this resource' })
    }
}