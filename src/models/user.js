const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address' })
            }
        }
    },
    name: {
        type: String,
        required: true
    },
    urlAvatar: {
        type: String,
        default: "http://simpleicon.com/wp-content/uploads/user1.png"
    },
    // tokens: [{
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }]
});

const saltRounds = 10;
// hash the password before the user is saved
UserSchema.pre('save', function(next) {
    var user = this;
    // hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) return next();

    // generate the hash
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        if (err) return next(err);
        // change the password to the hashed version
        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password) {
    var user = this;

    return bcrypt.compareSync(password, user.password);
};

UserSchema.methods.generateAuthToken = function() {
    // Generate an auth token for the user
    const user = this;
    const token = jwt.sign({
        name: user.name,
        username: user.username
    }, process.env.JWT_KEY, {
        expiresIn: '24h'
    });
    // user.tokens = user.tokens.concat({ token })
    // await user.save()
    return token;
}

module.exports = mongoose.model("user", UserSchema);