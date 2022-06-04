const express = require('express');
const clientRouter = new express.Router();
const { viewProduct, productDescription, categories, checkout} = require('../controllers/client')
const { isClient } = require("../auth/authLogic");



clientRouter
    .get('/viewProduct/:productId', viewProduct)

clientRouter
    .get('/productDescription/:productId', productDescription)

clientRouter
    .get('/categories', categories)

clientRouter
    .post('/checkout', isClient, checkout);

module.exports = clientRouter;
