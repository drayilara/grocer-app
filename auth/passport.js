const passport = require("passport");
const db = require("../custom_modules/db");
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt");

const Users = db.Users;

/*-------------------- LOCAL STRATEGY ----------------------*/

const localOptions = {
    usernameField: "email",
    passwordField: "password"
}

const localVerifyCallback = (username, password, done) => {
        Users.findOne({"local.email": username}, function(err, user){
            if (err) { return done(err); }

            if (!user) { return done(null, false); }


            const hash = user.local.password;

            bcrypt.compare(password, hash, function(err, result){

                if(err) return done(err)

                if(!result) return done(null, false)
                
                if(result) return done(null, user);
            })
        })
}

const localStrategy = new LocalStrategy(localOptions, localVerifyCallback);



/*--------------------- GOOGLE STRATEGY -------------------------*/




/*------------------------ MOUNT STRATEGIES ----------------------*/


passport.use(localStrategy);


/*------------------------ SESSION MANAGEMENT --------------------*/

passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  
  passport.deserializeUser(function(userId, done) {
    Users.findById({_id: userId}, function (err, user) {
      done(err, user);
    });
  });





  /*------------------- EXPORT -------------*/

  module.exports = passport;




























