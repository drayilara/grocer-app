// Init
require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const upload = require("./custom_modules/fileupload.js");
const bcrypt = require("bcrypt");
const passport = require("./auth/passport");
const session = require("express-session"); 
const MongoStore = require("connect-mongo");

// Load needed custom modules
const db = require('./custom_modules/db.js');
const Users = db.Users;

// Get Routers
const clientRouter = require('./routes/client.js');
const adminRouter = require('./routes/admin.js');

// Create server
const app = express(); 

// template engine -- ejs
app.set('view engine', 'ejs');

// app-level middleware
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public')); 

// Intercept any upload
app.use(upload);

// Mount Routers
app.use('/client', clientRouter);
app.use('/admin', adminRouter);

// connect to db
db.connectToDB();
const Categories = db.Categories;

// connect to server
connectToServer();

// Login and sessions
// 5 days of maxAge
const cookiesMaxAge = 432000000;

app.use(session({
    secret : process.env.SESSION_SECRET,
    store : MongoStore.create({mongoUrl: "mongodb://localhost:27017/shopdb", autoRemove: "native"}),
    resave: false,
    saveUninitialized : true,
    cookie: {maxAge: Date.now() + cookiesMaxAge}
}));

app.use(passport.initialize());
app.use(passport.session());









// Register route

app.route("/register")
    .get((req,res) =>  {
        res.render("userRegister");
    })

    .post((req,res) =>  {
        const saltRounds = 10;
        const password = req.body.password;
        const email = req.body.email;
    
        bcrypt.hash(password, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            if(err) console.log(err.message)
    
            else{
                // const newUser = new Users({
                //     "local.email" : email,
                //     "local.password" : hash
                // })

                const newUser = new Users({
                    local : {
                        email : email,
                        password : hash
                    }
                })
    
                Users.create(newUser, function(err, user){
                    if(err) console.log(err.message);
        
                    res.redirect("/login")
                })
            }       
        });
    })





// Login route

app.get("/login", (req,res) => {
    res.render("userLogin");
})

app.post("/login", passport.authenticate("local", {successRedirect: "/actualHome", failureRedirect: "/login"}));


















app.get('/actualHome', async (req,res) => {
    // Get All products and categories from db
        await Categories.find({}, (err, collections) => {
        if(err) res.send(`Error: ${err.message}`)
        let products;
        if(collections) {  
           products = collections.reduce((accumulator, currentCategory) => accumulator.concat(currentCategory.products),[]);
        } 
        res.render(`home`, {collections : collections, products: products});
     })
    })


















async function connectToServer() {
    const PORT = 3000;
    await app.listen(PORT, () => console.log('Web server is running on port ' + PORT));
}


