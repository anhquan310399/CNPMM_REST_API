const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.authLogin = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({ _id: data._id, username: data.username })
            .then((user) => {
                if (!user) {
                    return res.status(401).send({
                        success: false,
                        message: "Please login"
                    });
                }
                req.user = user;
                next();
            })
            .catch((err) => {
                return res.status(500).send({
                    success: false,
                    message: err.message,
                });
            });
    } catch (error) {
        res.status(401).send({
            success: false,
            message: 'Not authorized to access this resource'
        })
    }
}

exports.authAdmin = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        User.findOne({ _id: data._id, username: data.username, idPrivilege: 'admin' })
            .then((user) => {
                if (!user) {
                    return res.status(401).send({
                        success: false,
                        message: "Please login"
                    });
                }
                req.user = user;
                next();
            })
            .catch((err) => {
                return res.status(500).send({
                    success: false,
                    message: err.message,
                });
            });
    } catch (error) {
        res.status(401).send({
            success: false,
            message: 'Not authorized to access this resource'
        })
    }
}