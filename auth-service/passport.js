const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ where: { username } })
      .then(user => {
        if (!user || !user.comparePassword(password)) {
          return done(null, false);
        }
        return done(null, user);
      })
      .catch(err => done(err));
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findByPk(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});
