const express = require('express');
const adminRouter = new express.Router();
const controllers = require('../controllers/admin.js');
const models = require('../custom_modules/db.js');
const _ = require("lodash");
const upload = require("../custom_modules/fileupload.js");
const path = require("path");

const Categories = models.Categories


// Load controls
const allProducts = controllers.allProducts
const addProductGET = controllers.addProductGET
const addProductPOST = controllers.addProductPOST
const categoriesGET = controllers.categoriesGET
const categoriesPOST = controllers.categoriesPOST
const createCategory = controllers.createCategory
const adminCategoryActions = controllers.adminCategoryActions
const editCategory = controllers.editCategory
const adminProductActions = controllers.adminProductActions



adminRouter
    .get('/allProducts', allProducts)
    .post('/allProducts', adminProductActions)

adminRouter
    .route('/addProduct') 
    .get(addProductGET)
    .post(addProductPOST);

adminRouter
    .route('/categories')
    .get(categoriesGET)
    .post(categoriesPOST)

adminRouter
    .post('/createCategory', createCategory);

adminRouter
    .post('/categories/actions', adminCategoryActions)


adminRouter
    .post('/editCategory', editCategory)

adminRouter
    .post('/editProduct', (req,res) => {
        let status
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

            let productId = req.body.id;

            let date = new Date();
            date = date.toLocaleDateString('en-GB', {year:"numeric",month:"2-digit", day:"2-digit"});        
        
            const update = {
                name : _.capitalize(req.body.productName),
                description : _.capitalize(req.body.description),
                imageUrl : path.join('/uploads/', req.file.filename),
                price : Number(req.body.productPrice),
                vendor : _.capitalize(req.body.vendor),
                dateCreated : "" + date
            } 

            Categories.updateOne({"products" : {$elemMatch : { "_id" : productId}}}, update, function(err, result){
                if(err) return err.message;

                console.log(result);

                res.end();

                // res.redirect("/admin/allProducts");
            })
    })








module.exports = adminRouter