const express = require('express');
const adminRouter = new express.Router();
const controllers = require('../controllers/admin.js');
// const models = require('../custom_modules/db.js');
// const path = require("path");



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
const editProduct = controllers.editProduct



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
    .post('/editProduct', editProduct)






module.exports = adminRouter