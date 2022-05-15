// load needed custom module
const upload = require("../custom_modules/fileupload.js");
const db = require('../custom_modules/db.js');
// Lodash
const _ = require('lodash');
// Faker
const faker = require('faker');

// Get Models
const Categories = db.Categories

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