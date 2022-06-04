const express = require('express');
const adminRouter = new express.Router();
const {allProducts, addProductGET, addProductPOST, categoriesGET, categoriesPOST, createCategory, adminCategoryActions, editCategory, adminProductActions, editProduct, adminLandingPage} = require('../controllers/admin.js');
const { isAdmin } = require("../auth/authLogic");

adminRouter
    .get("/adminLandingPage", isAdmin, adminLandingPage)


adminRouter
    .get('/allProducts', isAdmin, allProducts)
    .post('/allProducts', isAdmin, adminProductActions)

adminRouter
    .route('/addProduct') 
    .get(isAdmin, addProductGET)
    .post(isAdmin, addProductPOST);

adminRouter
    .route('/categories')
    .get(isAdmin, categoriesGET)
    .post(isAdmin, categoriesPOST)

adminRouter
    .post('/createCategory', isAdmin, createCategory);

adminRouter
    .post('/categories/actions', isAdmin, adminCategoryActions)


adminRouter
    .post('/editCategory', isAdmin, editCategory)

adminRouter
    .post('/editProduct', isAdmin, editProduct)








module.exports = adminRouter