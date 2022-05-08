const express = require('express');
const adminRouter = new express.Router();
const controllers = require('../controllers/admin.js');

// Get controllers
const allProducts = controllers.allProducts
const addProductGET = controllers.addProductGET
const addProductPOST = controllers.addProductPOST
const categoriesGET = controllers.categoriesGET
const categoriesPOST = controllers.categoriesPOST
const createCategory = controllers.createCategory


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


adminRouter
    .get('/allProducts', allProducts)

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


module.exports = adminRouter