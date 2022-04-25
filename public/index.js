// dynamically generates price of products based on quantity ordered on checkout page

const currentPrice = document.getElementsByClassName('price-sold')[0].innerText;
let price = currentPrice.replace('$', '');
price = parseInt(price,10);
const units = document.getElementById('units-purchased');
units.addEventListener('change', updatePrice); 
document.addEventListener('keyup', updatePrice);
 
function updatePrice(evt) {
    evt.stopPropagation();
    let unitsPurchased = units.value
    unitsPurchased = parseInt(unitsPurchased, 10);
    let pricePerUnit = price
  
    if(unitsPurchased <= 0 || isNaN(unitsPurchased)){
        unitsPurchased = 1;
        alert('Please enter a valid number');
    }
    let finalPrice = pricePerUnit * unitsPurchased;
    document.getElementsByClassName('price-sold')[0].innerText = '$ ' + finalPrice;
}


