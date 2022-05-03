
/*  credit card format validation is done using the luhns algorithm : https://www.youtube.com/watch?v=PNXXqzU4YnM
Luhns only validates format of the card.In 2021,a package was released that can do the same thing,its based on Luhn.
We must use an API to connect with a payment gateway to check:
card status
process payment
scam association
holder details etc

You shouldn't proceed to this checks if the format is not valid.
*/

function luhnsCheck(card){
    let cumSum = 0;
    let i = 0;
    
    let numberAtEven,numberAtOdd,doubleDigits,sumOfDoubleDigits;
 
    let strArray = card.split('');
    let numberArr = strArray.map(Number)
 
    while(i < numberArr.length) {
       // operate on even index
       if( i % 2 == 0) {
          numberAtEven = numberArr[i] * 2;
          if(numberAtEven >= 10) {
             doubleDigits = numberAtEven.toString().split('').map(Number);
             sumOfDoubleDigits = doubleDigits[0] + doubleDigits[1];
             cumSum = cumSum + sumOfDoubleDigits;   
          }else {
            cumSum = cumSum + numberAtEven;
          }
       }else {
         // operate on odd index
         numberAtOdd = numberArr[i];
         cumSum = cumSum + numberAtOdd;
       }
       
      i++;
    }
 
    if(cumSum % 2 == 0) {
       return true;
    }
    return false; 
 }
 

 function validateCardFormat(card) {
     //Ensures card contains only numbers and is between 13 to 15 chars long(industry standard)
    let regex = new RegExp("^[0-9]{13,19}");
    
    if(!regex.test(card)) {
       return false;
    }
    return luhnsCheck(card);
 }

 module.exports = {
     validateCardFormat,
     luhnsCheck
 }

 

