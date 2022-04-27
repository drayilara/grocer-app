const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cardFormat = require(__dirname + '/validatecard.js');



const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public')); 
app.set('view engine', 'ejs');

let collections = ['Beverages', 'Vegetables', 'Dairy'];

let babyoilImg = '/images/baby-products/baby-1.jpg';
let babyharnessImg = '/images/baby-products/baby-2.webp';
let juiceImg = '/images/beverages/bev-img-1.jpg';
let cheeseImg ='/images/dairy/dairy-1.jpg';
let macImg = '/images/fast-food/fast-food-1.jpg';
let tomatoesImg = '/images/fruits-vegetables/fruits-2.webp';

products = [
    {productName: 'Johnson baby oil', productImage: babyoilImg, price: 100},
    {productName: 'Johns baby harness', productImage: babyharnessImg, price: 200},
    {productName: 'Coastal Juice', productImage: juiceImg, price: 150},
    {productName: 'Heavenly cheese', productImage: cheeseImg, price: 80},
    {productName: 'Big mac', productImage: macImg, price: 75},
    {productName: 'Amazon Tomatoes', productImage: tomatoesImg, price: 190}
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

    // package order details

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
    we would need to connect a payment API and validate the card further.
    */
})







































const port = 3000;
app.listen(port, () => console.log('Web server is running on port ' + port));
