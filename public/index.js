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

// add  event to quantity field and coerce
quantityField.addEventListener("change", updatePriceAndHiddenCheckoutFields)
quantityField.addEventListener("keyup", updatePriceAndHiddenCheckoutFields)

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










