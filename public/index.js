/* Determine Action @ admin/categories/action i.e the value of the hidden input field.This determines action in the backend.
This logic is reused for all admin actions in different pages and routes
*/

let viewActionBtns = document.querySelectorAll(".adminCategoryViewAction");
let editActionBtns = document.querySelectorAll(".adminCategoryEditAction");
let deleteActionBtns = document.querySelectorAll(".adminCategoryDeleteAction");

viewActionBtns.forEach(btn => {
    btn.onclick = getAction
})

editActionBtns.forEach(btn => {
    btn.onclick = getAction
})

deleteActionBtns.forEach(btn => {
    btn.onclick = getAction
})

function getAction(evt){
    let allActions = document.querySelectorAll(".adminCategoryAction")
    allActions.forEach(action => {
        action.value = evt.target.innerHTML;
    })
}

/* dynamically generates price of products based on quantity ordered on checkout page
Links with the product checkout page
*/

// get unit Price
let unitPrice = document.getElementById("productPrice").innerText;
// get unit Price without $ sign
unitPrice = unitPrice.replace("$", "");
    
// get quantity as defined by user ----> starts as an empty text field
// get quatity field
let quantityField = document.getElementById("unitsPurchased");

// add  event to quantity field and coerce.
quantityField.oninput = updatePriceAndHiddenCheckoutFields

function updatePriceAndHiddenCheckoutFields(){
    // get quantity as defined by user ----> starts as an empty text field
    let quantity = quantityField.value;
    let totalPrice;

    // coerce quantity to always be at least 1, and not a text
    if(quantity <= 0 || isNaN(quantity)) {
        alert("Please enter a valid quantity");
        quantity = 1
        // Update price
        totalPrice = unitPrice * quantity;
    }else {
        totalPrice = unitPrice * quantity
    }
    // Updates

    // update units purchased in checkout form
    document.getElementById("unitsPurchasedHidden").value = quantity;

    // update totalPrice in checkout form
    document.getElementById("totalPriceHidden").value = totalPrice;

    // update Price for user
    document.getElementById("productPrice").innerText = "$ " + totalPrice;
}













