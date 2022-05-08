// Init
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

// Load custom modules
const validateCard = require('./custom_modules/validatecard.js');
const db = require('./custom_modules/db.js');
const upload = require('./custom_modules/fileupload.js');

// Get Routers
const clientRouter = require('./routes/client.js');
const adminRouter = require('./routes/admin.js');

// Create server
const app = express(); 

// template engine
app.set('view engine', 'ejs');

// app-level middleware
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public')); 

// Load Routers
app.use('/client', clientRouter);
app.use('/admin', adminRouter);

// connect to db
db.connectToDB();
const Categories = db.Categories;
const Orders = db.Orders

//Dummy dataset

let collections = ['Beverages', 'Vegetables', 'Children'];

let babyoilImg = '/images/baby-products/baby-1.jpg';
let babyharnessImg = '/images/baby-products/baby-2.webp';
let juiceImg = '/images/beverages/bev-img-1.jpg';
let cheeseImg ='/images/dairy/dairy-1.jpg';
let macImg = '/images/fast-food/fast-food-1.jpg';
let tomatoesImg = '/images/fruits-vegetables/fruits-2.webp';

let products = [
    {productName: 'Johnson baby oil', productImage: babyoilImg, price: 100},
    {productName: 'Johns baby harness', productImage: babyharnessImg, price: 200},
    {productName: 'Coastal Juice', productImage: juiceImg, price: 150},
    {productName: 'Heavenly cheese', productImage: cheeseImg, price: 80},
    {productName: 'Big mac', productImage: macImg, price: 75},
    {productName: 'Amazon Tomatoes', productImage: tomatoesImg, price: 190}
]



app.get('/', (req,res) => {
    res.render(__dirname + `/views/home`, {collections : collections, products: products});
});



const port = 3000;
app.listen(port, () => console.log('Web server is running on port ' + port));
