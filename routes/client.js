const express = require('express');
const clientRouter = new express.Router();
const controllers = require('../controllers/client.js')
const { isClient } = require("../auth/authLogic");

// Get contorllers
const viewProduct = controllers.viewProduct
const productDescription = controllers.productDescription
const categories = controllers.categories
const checkout = controllers.checkout


clientRouter
    .get('/viewProduct/:productId', isClient, viewProduct)

clientRouter
    .get('/productDescription/:productId', productDescription)

clientRouter
    .get('/categories', categories)

clientRouter
    .post('/checkout', checkout);

module.exports = clientRouter;
