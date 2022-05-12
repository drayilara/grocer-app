// Load needed custom module
const validateCard = require("../custom_modules/validatecard.js");
const db = require("../custom_modules/db.js");

const Categories = db.Categories;

const viewProduct = async (req,res) => {
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
}

const productDescription = async (req,res) => {
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
}

const categories = async (req,res) => {
    await Categories.find({}, (err, categories) => {
        if(err) res.send(`Error: ${err.message}`);
        res.render('../views/clientCategoriesTable', {categories : categories});
    })  
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