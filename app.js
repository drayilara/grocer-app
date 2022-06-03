// Init
require("dotenv").config();
const express = require('express');
require("express-async-errors");
const bodyParser = require('body-parser');
const ejs = require('ejs');
const upload = require("./custom_modules/fileupload.js");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("./auth/passport");
const MongoStore = require("connect-mongo");
const _ = require("lodash");
const { isClient } = require("./auth/authLogic");

// Destructure db
const { Users, Categories, connectToDB } = require('./custom_modules/db.js');


// Get Routers
const clientRouter = require('./routes/client.js');
const adminRouter = require('./routes/admin.js');

// Create server
const app = express(); 

// template engine -- ejs
app.set('view engine', 'ejs');

// session options
const sessionOptions = {
    secret : process.env.SESSION_SECRET,
    store : MongoStore.create({mongoUrl: "mongodb://localhost:27017/shopdb"}),
    resave: false,
    saveUninitialized : true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}

/*
* -ensure session is fully set up before
* calling passport.session() else req.user may get 
* lost in transit.
*/

// app-level middleware
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public')); 
// order is very important here.
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use(upload);




// Mount Routers
app.use('/client', clientRouter);
app.use('/admin', adminRouter);

// connect to db
connectToDB();


// connect to server
connectToServer();


// Error handling---- Mounted at the bottom

const errorHandling = (err, req, res, next) => {
        console.log(err.message);
}









// Register route

app.route("/register")
    .get((req,res) =>  {
        res.render("userRegister");
    })

    .post(async (req,res) =>  {
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
                        isAdmin : false
                    }
                })
    
               await Users.create(newUser, function(err, user){
                    if(err) throw new Error(err);
        
                    res.redirect("/")
                })
            }       
        });
    })





// Login route

app.get("/login", (req,res) => {
        res.render("userLogin");
    })
    
app.post("/login", passport.authenticate("local", {failureRedirect: "/loginFailure", successRedirect: "/checkUserType"}));

app.get("/checkUserType", (req, res) => {
    
    let isAdmin = req.user.local.isAdmin;

    if(isAdmin) {
        // user is admin --- direct to default admin page
        res.redirect("/admin/allProducts");
    }else {
        // user is a client --- redirect to products page
        res.redirect("/");
    }

    res.end();
})


app.get("/loginFailure", (req,res) => {
    res.render("loginFailure");
});

// send client to google
app.get("/auth/google", passport.authenticate('google', { scope: ['profile'] }))


// google redirect url
app.get("/auth/google/toucan", passport.authenticate('google', { failureRedirect: '/loginFailure', successRedirect: '/' }))







/*
The code here is for facebook auth,but they require https even in testing enviroment.Their add domains input field is also currentlu buggy
Date : May 28, 2022.

app.get('/auth/facebook', passport.authenticate('facebook'));


// facebook redirect url
app.get("/auth/facebook/toucan",  passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: "/" }));

*/














app.get('/', isClient , async (req,res) => {
    // Get All products and categories from db
        await Categories.find({}, (err, collections) => {
        if(err) throw new Error(err);
        let products;
        if(collections) {  
           products = collections.reduce((accumulator, currentCategory) => accumulator.concat(currentCategory.products),[]);
        } 
        res.render(`home`, {collections : collections, products: products});
     })
    })
















app.use(errorHandling);

async function connectToServer() {
    const PORT = 80;
    await app.listen(PORT, () => console.log('Web server is running on port ' + PORT));
}


