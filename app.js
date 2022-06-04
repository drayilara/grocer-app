// Init
require("dotenv").config();
const express = require('express');
require("express-async-errors");
const bodyParser = require('body-parser');
const ejs = require('ejs');
const upload = require("./custom_modules/fileupload");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("./auth/passport");
const MongoStore = require("connect-mongo");
const _ = require("lodash");


// Destructure db
const { Users, Categories, connectToDB } = require('./custom_modules/db.js');


// Get Routers
const clientRouter = require('./routes/client');
const adminRouter = require('./routes/admin');
const authRouter = require("./routes/auth");

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
app.use("/auth", authRouter);

// connect to db
connectToDB();


// connect to server
connectToServer();


// Error handling---- Mounted at the bottom

const errorHandling = (err, req, res, next) => {
        console.log(err.message);
}



app.get('/', async (req,res) => {
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


