const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const keys = require('../config/keys');

const opts = {};
opts.jwtFormRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secrerOrKey = keys.secretOrKey;

module.exports = (passport) => {
  passport.use(new jwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id).then((user) => {
      if (user) {
        return done(null, user);//if user found
      }
      return done(null, false);//if user not found
    }).catch((err) => {
      console.log(err);
    })
  }))
}