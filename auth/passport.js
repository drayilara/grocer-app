const passport = require("passport");
const { Users } = require("../custom_modules/db");
const LocalStrategy = require("passport-local").Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require("bcrypt");



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

const googleCredentials = {
              clientID: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              callbackURL: "http://localhost/auth/google/toucan"
}

const googleVerifyCallback = (accessToken, refreshToken, profile, done) => {
              
              const userDataInJson = profile._json;
              const googleUserId = userDataInJson.sub;

              const newUser = new Users({
                google : {
                          name : userDataInJson.given_name,
                          token : accessToken,
                          image : userDataInJson.picture,
                          id : googleUserId
                         }
                      
              })

              // Check if user has signed in with google before

              Users.findOne({"google.id": googleUserId}, function(err, user){
                if(err){

                  console.log("Error: " + err.message);

                }else{

                  if(user){
                    // user exists.Call done() and create a session.Authenticate @ auth/google/toucan
                    done(err, user);

                  }else{
                    // The user has not signed in with google before. Create the user and call done();
                    Users.create(newUser, function(err, user){

                      if(err){

                        return err.message;

                      }else{
                        
                        if(user){
                            done(err, user);
                        }
                      }
                    })
                  }
                }
              })
}

const googleStrategy = new GoogleStrategy(googleCredentials, googleVerifyCallback);

/*------------------------ MOUNT STRATEGIES ----------------------*/


passport.use(localStrategy);
passport.use(googleStrategy);


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




























