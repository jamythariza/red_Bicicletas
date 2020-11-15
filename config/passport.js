const passport = require('passport');
const usuario = require('../models/usuario');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new LocalStrategy(
    function(email,password, done){
        usuario.findOne({email: email}, function(err,usuario){
            if(err) return done(err);
            if (!usuario) {
                return done(null, false, {message:'Email no existente o incorrecto'});
            }
            if (!usuario.validPassword(password)) {
                return done(null, false, {message:'Password incorrecto'})
            }

            return done(null, usuario);
        });
    }
));

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST + "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      Usuario.findOneOrCreateByGoogle(profile, function(err, user){
          return cb(err, user);
      });
    })
);

passport.serializeUser(
    function(user, cb){
        cb(null, user.id);
    }
);

passport.deserializeUser(function(id, cb){
    Usuario.findById(id, function(err,usuario){
        cb(err,usuario);
    });
});

module.exports = passport;