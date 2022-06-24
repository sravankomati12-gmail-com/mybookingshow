const { Strategy, ExtractJwt } = require("passport-jwt");
const usermodel = require("../models/userModel");
require("dotenv").config();

const opt = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.secretKey,
};

module.exports = (passport) => {
  passport.use(
    new Strategy(opt, async (payload, done) => {
      // console.log(payload);
      await usermodel
        .findById(payload.userid)
        .then((user) => {
          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
        })
        .catch((err) => {
          done(null, false);
        });
    })
  );
};
