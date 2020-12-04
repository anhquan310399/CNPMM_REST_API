const dbUser = require("../models/user");

exports.create = (req, res) => {
    const user = new dbUser({
        emailAddress: req.body.emailAddress,
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        surName: req.body.surName,
        urlAvatar: req.body.urlAvatar
    });

    user.save()
        .then(function(data) {
            user.generateAuthToken();
            res.send(data);
        })
        .catch((err) => {
            if (err.code == 11000)
                return res.json({ success: false, message: 'A user with that username already exists. ' });
            else
                return res.send(err);
        });
};

exports.findAll = (req, res) => {
    dbUser.find()
        .then((user) => {
            res.send(user);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users.",
            });
        });
};

exports.findUser = (req, res) => {
    dbUser.findById(req.params.id)
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

exports.login = (req, res) => {
    var user = {
        username: req.body.username,
        password: req.body.password
    }
    dbUser.findOne({ username: user.username })
        .then(data => {
            if (!data) {
                return res.json({ message: 'Not found username' });
            }
            if (data.comparePassword(user.password)) {
                res.send(data);
            } else {
                return res.json({ message: 'Password Incorrect!' });
            }
        })
        .catch(err => {
            res.send(err);
        })
}