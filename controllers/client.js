// Load needed custom module
const validateCard = require("../custom_modules/validatecard.js");
const db = require("../custom_modules/db.js");
const faker = require("faker");

const Categories = db.Categories;
const Orders = db.Orders;

const viewProduct = async (req,res) => {
    try{
        let productId = req.params.productId;
        const allProducts = [];
        await Categories.find({}, (err, all) => {
        if(err) res.send(`Error: ${err.message}`);
        all.forEach(category => {
            categoryProducts = category.products
            allProducts.push(categoryProducts);
        })
        let flattenedProductsArray = allProducts.flat();
        
        flattenedProductsArray.forEach(product => {
        if(productId == product._id){
            res.render('../views/productDescription', {product: product});
        }
    })
    })
    }catch(err){
        console.log(err)
    }
    
}

const productDescription = async (req,res) => {
    try{
        let productId = req.params.productId;
        const allProducts = [];
        await Categories.find({}, (err, all) => {
            if(err) res.send(`Error: ${err.message}`);
            all.forEach(category => {
                categoryProducts = category.products
                allProducts.push(categoryProducts);
            })
            let flattenedProductsArray = allProducts.flat();
            
            flattenedProductsArray.forEach(product => {
            if(productId == product._id){
                res.render('../views/checkoutForm', {product: product});
            }
        })
        })
    }catch(err){
        console.log(err);
    }
        
}

const categories = async (req,res) => {
    try{
        await Categories.find({}, (err, categories) => {
            if(err) res.send(`Error: ${err.message}`);
            res.render('../views/clientCategoriesTable', {categories : categories});
        })  
    }catch(error) {
        console.log(error)
    }
    
}

const checkout = async (req,res) => {
    let fname = req.body.fname;
    let lname = req.body.lname;
    let address = req.body.address;
    let email = req.body.email;
    let cardDetails = req.body.card;
    let productId = req.body.productId
    let totalPaid = Number(req.body.price);
    let unitsBought = Number(req.body.unitsBought);
    let dateOfPurchase = new Date();
    dateOfPurchase = dateOfPurchase.toLocaleDateString('en-GB', {year : 'numeric', month: '2-digit', day : '2-digit'});

    // Fake orders ----> Faker js
    /*
     let suffix = "@gmail.com";
     let firstName = faker.name.firstName()
     let uniqueEmail = firstName + suffix;
     let id = faker.random.alphaNumeric(10)
     let card = faker.finance.creditCardNumber();
    

     const newOrder = new Orders({
         fname : firstName,
         lname : faker.name.lastName(),
         email : uniqueEmail,
         address : faker.address.streetAddress(),
         cardDetails : card,
         productId : id,
         totalPaid : faker.commerce.price(),
         unitsBought : Math.floor(Math.random() * 5),
         dateOfPurchase : dateOfPurchase
     });

    */

     const newOrder = new Orders({
         fname : fname,
         lname : lname,
         email : email,
         address : address,
         cardDetails : cardDetails,
         productId : productId,
         totalPaid : totalPaid,
         unitsBought : unitsBought,
         dateOfPurchase : dateOfPurchase
     })


    try{
        await Orders.create(newOrder, function(err){
            if(err) console.log(`Error: ${err.message}`);
        })
    }catch(err){
        console.log(err);
    }
  

    if(validateCard(cardDetails)) {
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