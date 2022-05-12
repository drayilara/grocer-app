
const mongoose = require('mongoose');

// connect to the mongoDB database and create 'shopdb'
async function connectToDB(){
    try{
      await mongoose.connect('mongodb://localhost:27017/shopdb')
    }
    catch(err){
      console.log(`ERROR: ${err.message}`);
    }
 } 
 

 /*
The database has two collections.... orders and categories.later I will add user data and authentication
*/

const orderSchema = new mongoose.Schema({
    fname : {
      type : String,
      required : [1, 'Please enter your first name']
    },

    lname : {
      type : String,
      required : [1, 'Please enter your last name']
    },

    email : {
      type : String,
      required : [1, 'Enter an email']
    },

    address : {
      type : String,
      required : [1, 'Please an address']
    },

    productCategory : {
      type : String,
      required : [1, 'Must have product category']
    },

    productID : {
      type : String,
      required : [1, 'Product ID please!']
    },

    dateOfPurchase : {
      type : String,
      required : [1, 'Must have a purchase date']
    }, 

    cardDetails : String,

    price : {
      type : Number,
      required : [1, 'Price must be present']
    }
});

// category schema : Embeds 'products' to prevent complex, poor performing queries.

const productSchema = new mongoose.Schema({
    name : {
      type : String,
      required : [1, 'Every product must have a name']
    },

    description : {
      type : String,
      required : [1, 'Please enter the product description']
    },

    price : {
      type : Number,
      required : [1, 'Every product must have a price']
    },

    dateCreated : {
      type : String,
      required : [1, 'Enter date created']
    },

    imageUrl : {
      type : String,
      required : [1, 'Enter image location']
    },

    vendor : {
      type : String,
      required : [1, 'Enter vendor']
    }
})


const categorySchema = new mongoose.Schema({
category : {
  type : String,
  required : [1, 'Please enter a valid category']
},

products : [productSchema],

dateCreated : {
  type : String,
  required : [1, 'Please enter a creation date']
}
})

// Models
const Orders = mongoose.model('Order', orderSchema);
const Categories = mongoose.model('Category', categorySchema);

module.exports = {
    connectToDB,
    Orders,
    Categories
}