const { token } = require("morgan");
const dbUser = require("../models/user");
const jwt = require('jsonwebtoken');

exports.create = (req, res) => {
    const user = new dbUser({
        emailAddress: req.body.emailAddress,
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        urlAvatar: req.body.urlAvatar
    });

    user.save()
        .then(function(data) {
            // user.generateAuthToken();
            res.json(data);
        })
        .catch((err) => {
            if (err.code == 11000)
                return res.json({ success: false, message: 'A user with that username already exists. ' });
            else
                return res.json(err);
        });
};

exports.findAll = (req, res) => {
    dbUser.find()
        .then((users) => {
            res.send(users);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users.",
            });
        });
};

exports.findUser = (req, res) => {
    dbUser.findOne({ username: req.params.username })
        .then((user) => {
            if (!user) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            res.send(user);
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message,
            });
        });
};

exports.update = (req, res) => {

    var id = req.user._id;
    if (id != req.params.id) {
        return res.send({ message: 'Not authorized to update user' });
    }

    dbUser.findById(req.params.id)
        .then((user) => {
            if (!user) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            if (req.body.emailAddress) user.emailAddress = req.body.emailAddress;
            if (req.body.username) user.username = req.body.username;
            if (req.body.password) user.password = req.body.password;
            if (req.body.firstName) user.password = req.body.firstName;
            if (req.body.surName) user.password = req.body.surName;
            if (req.body.urlAvatar) user.password = req.body.urlAvatar;


            user.save(function(err) {
                if (err) return res.send(err);

                // return a message
                res.json({ message: 'User updated!' });
            });
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message,
            });
        });
};

exports.delete = (req, res) => {

    var id = req.user._id;
    if (id != req.params.id) {
        return res.send({ message: 'Not authorized to delete user' });
    }

    dbUser.findByIdAndRemove(req.params.id)
        .then((user) => {
            if (!user) {
                return res.status(404).send({
                    message: "Not found",
                });
            }
            res.send({ message: "Delete successfully!" });
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message,
            });
        });
};

exports.authenticate = (req, res) => {
    dbUser.findOne({ username: req.body.username })
        .then(user => {
            console.log(user);
            if (!user) {
                return res.json({
                    success: false,
                    message: 'Authentication failed. User not found'
                });
            } else if (user) {
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    return res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password!'
                    });
                } else {
                    let superSecret = process.env.JWT_KEY;
                    let token = jwt.sign({
                        name: user.emailAddress,
                        username: user.username
                    }, superSecret, {
                        expiresIn: '20h'
                    });
                    console.log(token);
                    res.json({
                        success: true,
                        message: 'Login successfully!',
                        token: token
                    })
                }
            }
        })
        .catch(err => {
            res.json({
                success: false,
                message: err.message
            })
        })
}

exports.authenticateByGoogle = (req, res) => {
    dbUser.findById(req.user._id)
        .then(user => {
            console.log(user);
            if (!user) {
                return res.json({
                    success: false,
                    message: 'Authentication failed. User not found'
                });
            } else if (user) {

                let superSecret = process.env.JWT_KEY;
                let token = jwt.sign({
                    name: user.emailAddress,
                    username: user.username
                }, superSecret, {
                    expiresIn: '20h'
                });
                console.log(token);
                res.json({
                    success: true,
                    message: 'Login successfully!',
                    token: token
                })

            }
        })
        .catch(err => {
            res.json({
                success: false,
                message: err.message
            })
        })
}