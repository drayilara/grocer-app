const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const cardFormat = require(__dirname + '/validatecard.js');
const multer = require('multer');
const fs = require('fs')


const app = express();


app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public')); 

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('imageFile');

// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }



app.set('view engine', 'ejs');

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

let orders = [];

app.get('/', (req,res) => {
    res.render(__dirname + `/views/home`, {collections : collections, products: products});
});


app.get('/view-product/:product', (req,res) => {
    let productName = req.params.product;
    let clickedProduct = products.filter(product => {
        if(product.productName == productName){
            return product;
        }
    })

    clickedProduct.forEach(product => {
        res.render(__dirname + '/views/product-description', {product: product});
    })
})

app.get('/checkout/:product', (req,res) => {
    let productName = req.params.product;
    let clickedProduct = products.filter(product => {
        if(product.productName == productName){
            return product;
        }
    });

    clickedProduct.forEach(product => {
        res.render(__dirname + '/views/checkout', {product: product});
    })

})

app.post('/checkout', (req,res) => {
    let fname = req.body.fname;
    let lname = req.body.lname;
    let address = req.body.address;
    let email = req.body.email;
    let card = req.body.card;
    let price = req.body.sellingPrice;

    // bundle order payload

    let order = {
        fname : fname,
        lname : lname,
        address : address,
        email : email,
        amount_paid : price,
    }

    orders.push(order);

    // validate card format
    let luhnsCheck = cardFormat.luhnsCheck;
    let validateCardFormat = cardFormat.validateCardFormat;

    if(validateCardFormat(card)) {
        res.send('<h1> Payment successful </h1>');
    }else {
        res.send('<h1> Please enter valid card details </h1>');
    }
     /*
    This implementation is an oversimplication,in reality,to process payments,
    we would need to connect a payment gateway and validate the card further.
    */
})

app.get('/categories', (req,res) => {
    res.render(__dirname + '/views/client-cat-page', {collectionAndProduct : collectionAndProduct});
})

app.get('/vendor-all-products', (req,res) => {
    let rowCount = 0;
    res.render(__dirname + '/views/vendor-all-products-table', {products: products, rowCount: rowCount});
})


app.route('/vendor-add-product') 
    .get((req,res) => {
    let status = '';
    res.render(__dirname + '/views/vendor-addProduct-form', {status : status})
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

    const date = new Date();

    // bundle payload
    const payload = {
        productName : req.body.productName,
        imageUrl : path.join('/uploads/', req.file.filename),
        price : req.body.productPrice,
        vendor : req.body.vendor,
        category : req.body.category,
        date : date.toLocaleDateString('en-GB', {year:"numeric",month:"2-digit", day:"2-digit"})
    } 
    res.render(__dirname + '/views/vendor-addProduct-form', {status : status});
  });
});

app.route('/vendor/categories')
  .get((req,res) => {
    let rowCount = 0
    res.render( __dirname + '/views/vendor-all-cat', {collectionAndProduct: collectionAndProduct, rowCount: rowCount});
  })

  .post((req,res) => {
    let status = ""
    res.render(__dirname + '/views/vendor-addCat-form', {status:status});
  })

app.post('/vendor/createCategory', (req,res) => {
  let newCat = req.body.categoryName;
  let date = new Date();

  // payload
  let category = {
    categoryName : newCat,
    dateCreated : date.toLocaleDateString('en-GB', {year:"numeric",month:"2-digit", day:"2-digit"})
  }
  let status = "Successfully created";
  res.render(__dirname + '/views/vendor-addCat-form', {status:status});
})











const port = 3000;
app.listen(port, () => console.log('Web server is running on port ' + port));
