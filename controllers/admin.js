

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




const allProducts = (req,res) => {
    let rowCount = 0;
    res.render('../views/adminAllProductTable', {products: products, rowCount: rowCount});
}

const addProductGET = (req,res) => {
    let status = '';
    res.render('../views/adminAddProduct', {status : status})
}

const addProductPOST = (req, res) => {
    let status;
    upload(req, res, (err) => {
    if(err){
        status = err.message
    } else {
      if(req.file == undefined){
        status = 'Please upload a file';
      } else {
        status = 'Uploaded succesfully';  
      }
    }

    let date = new Date();
    date = date.toLocaleDateString('en-GB', {year:"numeric",month:"2-digit", day:"2-digit"});

    let category = req.body.category;

    const newProduct = {
        name : req.body.productName,
        imageUrl : path.join('/uploads/', req.file.filename),
        price : Number(req.body.productPrice),
        vendor : req.body.vendor,
        dateCreated : date
    } 
    res.render('../views/adminAddProduct', {status : status});
  });
}

const categoriesGET = (req,res) => {
    let rowCount = 0
    res.render('../views/adminCategories', {collectionAndProduct: collectionAndProduct, rowCount: rowCount});
}

const categoriesPOST = (req,res) => {
    let status = ""
    res.render('../views/adminAddCategory', {status:status});
}

const createCategory =  async (req,res) => {
    let newCat = req.body.categoryName;
    let date = new Date();
    date =  date.toLocaleDateString('en-GB', {year:"numeric",month:"2-digit", day:"2-digit"});
  
    let newCategory = {
      category : newCat,
      dateCreated : date
    }
  
    let status;
  
    try{
      await Categories.create(newCategory)
      status = "Successfully created";
    }catch(err){
      status = `An error occured: ${err.message}`
      console.log(`Error: ${err.message}`);
    }
    res.render('../views/adminAddCategory', {status:status});
}

module.exports = {
    allProducts,
    addProductGET,
    addProductPOST,
    categoriesGET,
    categoriesPOST,
    createCategory
}