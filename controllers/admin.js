// load needed custom module
const upload = require("../custom_modules/fileupload.js");
const db = require('../custom_modules/db.js');
// Lodash
const _ = require('lodash');
// Faker
const faker = require('faker');

// Get Models
const Categories = db.Categories


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




const allProducts = (req,res) => {
    let rowCount = 0;
    res.render('../views/adminAllProductTable', {products: products, rowCount: rowCount});
}

const addProductGET = (req,res) => {
    let status = '';
    res.render('../views/adminAddProduct', {status : status})
}

const addProductPOST = async (req, res) => {
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
    }});

    let date = new Date();
    date = date.toLocaleDateString('en-GB', {year:"numeric",month:"2-digit", day:"2-digit"});

    let category = req.body.category;
    category = _.capitalize(category);
    
    // Actual user data

    const newProduct = {
        name : _.capitalize(req.body.productName),
        description : _.capitalize(description),
        imageUrl : path.join('/uploads/', req.file.filename),
        price : Number(req.body.productPrice),
        vendor : _.capitalize(req.body.vendor),
        dateCreated : date
    } 

    /* fake data from faker.js

    const newProduct = {
      name : _.capitalize(faker.commerce.productName()),
      description : faker.commerce.productDescription(),
      imageUrl : faker.image.fashion(),
      price : Number(faker.commerce.price()),
      vendor : _.capitalize(faker.name.findName()),
      dateCreated : date
    }

    */

    const query = {category : category}
    const update = {$push : {products : newProduct}}

    const updatedDocument = await Categories.findOneAndUpdate(query, update, {new : true});

    res.render('../views/adminAddProduct', {status : status});
}

const categoriesGET = (req,res) => {
    let rowCount = 0
    res.render('../views/adminCategories', {collectionAndProduct: collectionAndProduct, rowCount: rowCount});
}

const categoriesPOST = (req,res) => {
    let status = ""
    res.render('../views/adminAddCategory', {status:status});
}

const createCategory =  async (req,res) => {
    let newCat = _.capitalize(req.body.categoryName);
    let date = new Date();
    date =  date.toLocaleDateString('en-GB', {year:"numeric",month:"2-digit", day:"2-digit"});
  
    // Actual user data

    let newCategory = {
      category : newCat,
      dateCreated : date
    }


    // Use faker to generate data for production

    // let newCategory = {
    //   category : faker.commerce.department(),
    //   dateCreated : date
    // }
  
    let status;
  
    try{
      await Categories.create(newCategory)
      status = "Successfully created";
    }catch(err){
      status = `An error occured: ${err.message}`
      console.log(`Error: ${err.message}`);
    }
    res.render('../views/adminAddCategory', {status:status});
}

module.exports = {
    allProducts,
    addProductGET,
    addProductPOST,
    categoriesGET,
    categoriesPOST,
    createCategory
}