
const passport = require("../auth/passport");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { Users } = require("../custom_modules/db");

const loginGET = ((req,res) => {
    res.render("../views/userLogin");
});



const loginPOST = (passport.authenticate("local", {failureRedirect: "/auth/loginFailure", successRedirect: "/auth/checkUserType"}))


const checkUserType = ((req, res) => {

    let isAdmin = req.user.local.isAdmin;

    if(isAdmin) {
        // user is admin --- direct to default admin page
        res.redirect("/admin/adminLandingPage");
    }else {
        // user is a client --- redirect to products page
        res.redirect("/");
    }

})


const  googleSendCredentials = (passport.authenticate('google', { scope: ['profile'] }));


const googleCallback = (passport.authenticate('google', { failureRedirect: '/auth/loginFailure', successRedirect: '/' }));


const loginFailure = ((req,res) => {
    res.render("../views/loginFailure");
})


const registerGET = ((req,res) =>  {
    res.render("../views/userRegister");
})


const registerPOST = async (req,res) =>  {
    const saltRounds = 10;
    const password = req.body.password;
    const email = req.body.email.trim();
    const name = _.capitalize(req.body.name.trim());

    

    await bcrypt.hash(password, saltRounds, async function(err, hash) {
        // Store hash in your password DB.
        if(err) throw new Error(err);

        else{
            const newUser = new Users({
                local : {
                    name: name,
                    email : email,
                    password : hash,
                    isAdmin : false,
                    role : ""
                }
            })

        await Users.create(newUser, function(err, user){
                if(err) throw new Error(err);
    
                res.redirect("/")
            })
        }       
    });
}



module.exports = {
    loginGET,
    loginPOST,
    checkUserType,
    googleSendCredentials,
    googleCallback,
    loginFailure,
    registerGET,
    registerPOST
}


