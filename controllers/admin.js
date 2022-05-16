// load needed custom module
const upload = require("../custom_modules/fileupload.js");
const db = require('../custom_modules/db.js');
// Lodash
const _ = require('lodash');
// Faker
const faker = require('faker');

// Get Models
const Categories = db.Categories
















const allProducts = async (req,res) => {
    let rowCount = 0;
    // Get all products from db
      try{
        await Categories.find({}, (err, collections) => {
          if(err) res.send(`Error: ${err.message}`)
          let products;
          if(collections) {  
             products = collections.reduce((accumulator, currentCategory) => accumulator.concat(currentCategory.products),[]);
             res.render('../views/adminAllProductTable', {products: products, rowCount: rowCount});
          } 
        })     
      }catch(err){
        console.log(err.message);
      }      
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
        category : _.capitalize(req.body.category),
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










const categoriesGET = async (req,res) => {
    let rowCount = 0
    try{
     await Categories.find({}, function(err, categories){
        res.render('../views/adminCategories', {categories: categories, rowCount: rowCount});
      })
    }catch(err){
      console.log(err.message);
    }  
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











const adminCategoryActions = (req,res) => {
  let action = req.body.action
  let categoryId = req.body.id;
  
  if(action == "Delete") {
      Categories.deleteOne({_id : categoryId}, function(err){
          if(err){
              console.log(err.message);
          }
      })
      res.redirect("/admin/categories");
  }

  if(action == "View") {
      Categories.findOne({_id: categoryId}, function(err, foundCategory){
          if(err) console.log(err.message);

          else{
              let rowCount = 0
              let category = foundCategory.category;
              let products = foundCategory.products;
              res.render("../views/adminViewCategory", {category: category, products: products, rowCount: rowCount});
          }
      })
  }

  if(action == "Edit") {
      res.render("../views/adminEditCategoryForm", {categoryId: categoryId, status: ""});
  }

}













const editCategory =  ((req,res) => {
  let categoryId = req.body.categoryId;
  let updateName = _.capitalize(req.body.categoryName);

  let update = {category: updateName}
  filter = {_id: categoryId}
  
  Categories.updateOne(filter, update, function(err){
      if(err) console.log(err.message);
  })
  res.redirect("/admin/categories");
});









const adminProductActions =  ((req,res) => {
  let action = req.body.action;
  let productId = req.body.id;
  let productName = req.body.productName

  
  if(action == "Delete") {
     Categories.updateOne({}, {$pull: {products: {"_id": productId}}}, function(err,result){
         if(err) return err.message
         console.log(result);
     });
     res.redirect("/admin/allProducts");
  }

  if(action == "Edit") {
      res.render("../views/adminEditProductForm", {status: "", productId: productId, productName: productName});
  }


  if(action == "View") {
      let allProducts = [];
      Categories.find({}, function(err, allCategories){
          if(err) return err.message;

          if(allCategories){
              allCategories.forEach(category => {
                  allProducts.push(category.products);
              })
          }

          allProducts = allProducts.flat();

          allProducts.forEach(product => {
              if(product._id == productId) {
                  res.render("../views/adminViewSingleProduct", {product : product});
              }
      })
      })      
  }
})









module.exports = {
    allProducts,
    addProductGET,
    addProductPOST,
    categoriesGET,
    categoriesPOST,
    createCategory,
    adminCategoryActions,
    editCategory,
    adminProductActions
}