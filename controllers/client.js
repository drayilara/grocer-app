// Load needed custom module
const validateCard = require("../custom_modules/validatecard.js");


// Dummy data
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


const viewProduct = (req,res) => {
        let productName = req.params.product;
        let clickedProduct = products.filter(product => {
            if(product.productName == productName){
                return product;
            }
        })
    
        clickedProduct.forEach(product => {
            res.render('../views/productDescription', {product: product});
        })
}

const productDescription =  (req,res) => {
    let productName = req.params.product;
    let clickedProduct = products.filter(product => {
        if(product.productName == productName){
            return product;
        }
    });

    clickedProduct.forEach(product => {
        res.render('../views/checkoutForm', {product: product});
    })

}

const categories = (req,res) => {
    res.render('../views/clientCategoriesTable', {collectionAndProduct : collectionAndProduct});
}

const checkout =  (req,res) => {
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

    if(validateCard(card)) {
        res.send('<h1> Payment successful </h1>');
    }else {
        res.send('<h1> Please enter valid card details </h1>');
    }
     /*
    This implementation is an oversimplication,in reality,to process payments,
    we would need to connect a payment gateway and validate the card further.
    */
}

module.exports = {
    viewProduct,
    productDescription,
    categories,
    checkout
}