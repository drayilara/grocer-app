const express = require("express");
const authRouter = express.Router();
const  { loginGET, loginPOST, checkUserType, googleSendCredentials, googleCallback, loginFailure, registerGET, registerPOST } = require("../controllers/auth");

/* -------- LOCAL -----------*/

authRouter
    .route("/register")
    .get(registerGET)
    .post(registerPOST)


authRouter
    .route("/login")

    .get(loginGET)
    .post(loginPOST);


authRouter
    .get("/checkUserType", checkUserType)


/* ------------- 3RD PARTY AUTH -----------*/


authRouter
    .get("/google", googleSendCredentials);



authRouter 
    .get("/google/toucan", googleCallback);



/*
The code here is for facebook auth,but they require https even in testing enviroment.Their add domains input field is also currentlu buggy
Date : May 28, 2022.

app.get('/auth/facebook', passport.authenticate('facebook'));


// facebook redirect url
app.get("/auth/facebook/toucan",  passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: "/" }));

*/

/*------ HANDLE BAD CREDENTIALS -----*/

authRouter
    .get("/loginFailure", loginFailure);

    

module.exports = authRouter;