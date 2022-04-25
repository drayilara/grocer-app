const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');


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






































const port = 3000;
app.listen(port, () => console.log('Web server is running on port ' + port));
