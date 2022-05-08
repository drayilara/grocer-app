// Init
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

// Load custom modules
const validateCard = require(__dirname + '/custom_modules/validatecard.js');
const db = require(__dirname + '/custom_modules/db.js');
const upload = require(__dirname + '/custom_modules/fileupload.js');

// Create server
const app = express(); 

// template engine
app.set('view engine', 'ejs');

// app-level middleware
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public')); 

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

let collectionAndProduct = [
    {collection : 'Beverages', products : ['Coastal Juice']},
    {collection : 'Children', products : ['Johns baby harness', 'Johnson baby oil']},
    {collection : 'Vegetables', products : ['Amazon tomatoes']}
]



app.get('/', (req,res) => {
    res.render(__dirname + `/views/home`, {collections : collections, products: products});
});


app.get('/client/viewProduct/:product', (req,res) => {
    let productName = req.params.product;
    let clickedProduct = products.filter(product => {
        if(product.productName == productName){
            return product;
        }
    })

    clickedProduct.forEach(product => {
        res.render(__dirname + '/views/productDescription', {product: product});
    })
})

app.get('/client/productDescription/:product', (req,res) => {
    let productName = req.params.product;
    let clickedProduct = products.filter(product => {
        if(product.productName == productName){
            return product;
        }
    });

    clickedProduct.forEach(product => {
        res.render(__dirname + '/views/checkoutForm', {product: product});
    })

})

app.post('/client/checkout', (req,res) => {
    let fname = req.body.fname;
    let lname = req.body.lname;
    let address = req.body.address;
    let email = req.body.email;
    let card = req.body.card;
    let priceSold = Number(req.body.sellingPrice);
    let date = new Date();
    date = date.toLocaleDateString('en-GB', {year : 'numeric', month: '2-digit', day : '2-digit'});

    // const order = {
    //   fname : fname,
    //   lname : lname,
    //   email : email,
    //   address : address,
    //   productCategory,
    //   productID,
    //   dateOfPurchase : date,
    //   cardDetails : card,
    //   price : priceSold,
    // }

    // validateCard from criticalModules/validateCard.js
    if(validateCard(card)) {
        res.send('<h1> Payment successful </h1>');
    }else {
        res.send('<h1> Please enter valid card details </h1>');
    }
     /*
    This implementation is an oversimplication,in reality,to process payments,
    we would need to connect a payment gateway and validate the card further.
    */
})

app.get('/client/categories', (req,res) => {
    res.render(__dirname + '/views/clientCategoriesTable', {collectionAndProduct : collectionAndProduct});
})

app.get('/admin/allProducts', (req,res) => {
    let rowCount = 0;
    res.render(__dirname + '/views/adminAllProductTable', {products: products, rowCount: rowCount});
})


app.route('/admin/addProduct') 
    .get((req,res) => {
    let status = '';
    res.render(__dirname + '/views/adminAddProduct', {status : status})
})
    .post((req, res) => {
    let status;
    upload(req, res, (err) => {
    if(err){
        status = err.message
    } else {
      if(req.file == undefined){
        status = 'Please upload a file';
      } else {
        status = 'Uploaded succesfully';  
      }
    }

    let date = new Date();
    date = date.toLocaleDateString('en-GB', {year:"numeric",month:"2-digit", day:"2-digit"});

    let category = req.body.category;

    const newProduct = {
        name : req.body.productName,
        imageUrl : path.join('/uploads/', req.file.filename),
        price : Number(req.body.productPrice),
        vendor : req.body.vendor,
        dateCreated : date
    } 
    res.render(__dirname + '/views/adminAddProduct', {status : status});
  });
});



app.route('/admin/categories')
  .get((req,res) => {
    let rowCount = 0
    res.render( __dirname + '/views/adminCategories', {collectionAndProduct: collectionAndProduct, rowCount: rowCount});
  })

  .post((req,res) => {
    let status = ""
    res.render(__dirname + '/views/adminAddCategory', {status:status});
  })



app.post('/admin/createCategory', async (req,res) => {
  let newCat = req.body.categoryName;
  let date = new Date();
  date =  date.toLocaleDateString('en-GB', {year:"numeric",month:"2-digit", day:"2-digit"});

  let newCategory = {
    category : newCat,
    dateCreated : date
  }

  let status;

  try{
    await Categories.create(newCategory)
    status = "Successfully created";
  }catch(err){
    status = `An error occured: ${err.message}`
    console.log(`Error: ${err.message}`);
  }
  res.render(__dirname + '/views/adminAddCategory', {status:status});
});











const port = 3000;
app.listen(port, () => console.log('Web server is running on port ' + port));
