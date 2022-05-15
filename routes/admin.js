const express = require('express');
const adminRouter = new express.Router();
const controllers = require('../controllers/admin.js');
const models = require('../custom_modules/db.js');
const _ = require("lodash");

const Categories = models.Categories


// Load controls
const allProducts = controllers.allProducts
const addProductGET = controllers.addProductGET
const addProductPOST = controllers.addProductPOST
const categoriesGET = controllers.categoriesGET
const categoriesPOST = controllers.categoriesPOST
const createCategory = controllers.createCategory
const adminActions = controllers.adminActions
const editCategory = controllers.editCategory



adminRouter
    .get('/allProducts', allProducts)
    .post('/allProducts', (req,res) => {
        let action = req.body.action;
        let productId = req.body.id;

        
        if(action == "Delete") {
           Categories.updateOne({}, {$pull: {products: {"_id": productId}}}, function(err,result){
               if(err) return err.message
               console.log(result);
           });
           res.redirect("/admin/allProducts");
        }


        if(action == "Edit") {
            
        }


        if(action == "View") {

        }
    })

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
    .post('/categories/actions', adminActions)


adminRouter
    .post('/editCategory', editCategory)








module.exports = adminRouter