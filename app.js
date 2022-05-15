// Init
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

// Load needed custom modules
const db = require('./custom_modules/db.js');

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

// Mount Routers
app.use('/client', clientRouter);
app.use('/admin', adminRouter);

// connect to db
db.connectToDB();
const Categories = db.Categories;

// connect to server
connectToServer();


app.get('/', async (req,res) => {
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


