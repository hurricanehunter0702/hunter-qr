'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const memberModel = require('./models/memberModel');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// local strategy for username password login
passport.use(new Strategy(
    async (username, password, done) => {
      try {
        const user = await memberModel.findOne({email: username});
        if (user === null) {
          return done(null, false, {message: 'Incorrect email.'});
        }
        const validate = await bcrypt.compare(password, user.password);
        if (!validate) {
          return done(null, false, {message: 'Incorrect password.'});
        }
        const strippedUser = user.toObject();
        delete strippedUser.password;
        return done(null, strippedUser, {message: 'Logged In Successfully'});
      }
      catch (err) {
        return done(err);
      }
    }));

// TODO: JWT strategy for handling bearer token
passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: '1234asdf',
    },
    async (jwtPayload, done) => {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      try {
        const user = await memberModel.findById(jwtPayload._id,
            '-password -__v');
        if (user !== null) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      }
      catch (e) {
        return done(null, false);
      }
    },
));

module.exports = passport;
