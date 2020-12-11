const passport = require('passport');
const User = require('../models/user')


const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const CLIENT_GOOGLE_KEY = "505292012597-p84up3smu19108foes5un0lhk4ig1sp2.apps.googleusercontent.com";
const CLIENT_GOOGLE_SECRET_KEY = 'ErnfVUgh-hXu0QeXG2fYgKeB';

const { OAuth2Client } = require('google-auth-library');

var opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY
}

passport.use(
    'login-token',
    new JwtStrategy(opts, (token, done) => {
        console.log("Token " + JSON.stringify(token));
        User.findOne({ username: token.username }, 'name username password')
            .then((user) => {
                if (!user) {
                    return done(null, null, { message: 'Not found user' });
                }
                console.log(user);
                done(null, user);
            })
            .catch(err => {
                return done(err);
            })
    })
);



passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = passport;