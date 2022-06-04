
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

    productId : {
      type : String,
      required : [1, 'Product ID please!']
    },

    dateOfPurchase : {
      type : String,
      required : [1, 'Must have a purchase date']
    }, 

    cardDetails : {
      type : String,
      required : [1, "Please enter card details"]
    },

    totalPaid : {
      type : Number,
      required : [1, 'Price must be present']
    }, 

    unitsBought : {
      type : String,
      required : [1, "Provide units bought"]
    }
});



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

    category : {
      type : String,
      required : [1, 'Please add a category']
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



function isValidEmail(){
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return re.test(this.local.email);
}

function isValidPassword(){
      if(this.password == "" && this.password.length < 3){
        return false
      }else{
        return true;
      }
}


const userSchema = mongoose.Schema({
    local : {
          name : {
            type : String,
            trim: true
          },

          password: {
          validate: [isValidPassword, "Please supply a password of at least 4 characters in length"],
          type : String,
          trim : true
          },
      
          email : {
          type : String,
          validate: [isValidEmail, "Please enter a valid email"],
          unique: true
          },

          isAdmin : {
            required : [true, "Is user admin?"],
            type : Boolean
          },

          role : {
            required : [true, "Pls supply role"],
            type : String
          }

    },

     google : {
        name : String,
        token : String,
        image : String,
        id : String
    },

     facebook : {
        name : String,
        token : String,
        image : String,
        id : String
    } 
})


// Models
const Orders = mongoose.model('Order', orderSchema);
const Categories = mongoose.model('Category', categorySchema);
const Users = mongoose.model("User", userSchema);

module.exports = {
    connectToDB,
    Orders,
    Categories,
    Users
}
