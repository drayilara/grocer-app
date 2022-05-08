const express = require('express');
const clientRouter = new express.Router();
const controllers = require('../controllers/client.js')

// Get contorllers
const viewProduct = controllers.viewProduct
const productDescription = controllers.productDescription
const categories = controllers.categories
const checkout = controllers.checkout

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


clientRouter
    .get('/viewProduct/:product', viewProduct)

clientRouter
    .get('/productDescription/:product', productDescription)

clientRouter
    .get('/categories', categories)

clientRouter
    .post('/checkout', checkout);

module.exports = clientRouter;
