const passport = require('passport');
const User = require('../models/user')


const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const CLIENT_GOOGLE_KEY = "505292012597-1iljdvj992fmflo3tr2p7ai2fo3a7mn7.apps.googleusercontent.com";
const CLIENT_GOOGLE_SECRET_KEY = 'iThL4EKXM9VpADBbjlDQYpS3';


const CLIENT_FACEBOOK_KEY = "3305857322858841";
const CLIENT_FACEBOOK_SECRET_KEY = '8f43373273f70f2d66cfdd3ea88d4f7f';



var GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


var opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY
}

passport.use(
    'login-token',
    new JwtStrategy(opts, (token, done) => {
        User.findOne({ username: token.username }, 'name username password')
            .then((user) => {
                if (!user) {
                    return done(null, null, { message: 'Not found user' });
                }
                done(null, user);
            })
            .catch(err => {
                return done(err);
            })
    })
);


passport.use(
    'google',
    new GoogleStrategy({
            clientID: CLIENT_GOOGLE_KEY,
            clientSecret: CLIENT_GOOGLE_SECRET_KEY,
            callbackURL: "/user/auth/google/callback",
            passReqToCallback: true
        },
        function(request, accessToken, refreshToken, profile, done) {
            User.findOne({ emailAddress: profile.email }, function(err, user) {
                if (user) {
                    return done(null, user);
                } else {
                    new User({
                            emailAddress: profile.email,
                            username: profile.email,
                            password: profile.id,
                            name: profile.family_name + " " + profile.given_name,
                            urlAvatar: profile.picture
                        }).save()
                        .then(newUser => {
                            return done(null, newUser);
                        })
                        .catch(err => {
                            return done(err, null);
                        })
                }
            });
        }
    ));


passport.use(
    'facebook', new FacebookStrategy({
            clientID: CLIENT_FACEBOOK_KEY,
            clientSecret: CLIENT_FACEBOOK_SECRET_KEY,
            callbackURL: '/user/auth/facebook/callback'
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile);
            User.findOne({ username: profile.id }, function(err, user) {
                if (user) {
                    return done(null, user);
                } else {
                    new User({
                            emailAddress: profile.id + '@facebook.com',
                            username: profile.id,
                            password: profile.id,
                            name: profile.displayName
                        }).save()
                        .then(newUser => {
                            return done(null, newUser);
                        })
                        .catch(err => {
                            return done(err, null);
                        })
                }
            });
        }))


passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id).then(user => {
        done(null, user);
    });
});

module.exports = passport;