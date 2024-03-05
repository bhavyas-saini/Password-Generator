const lengthDisplay = document.querySelector("[data-lenght]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const passwordDisplay = document.querySelector("[data-passgenrator]");
const copyButton = document.querySelector("[data-copy]");
const copyMessage = document.querySelector("[data-copymessage]");
const uppercaseCheckbox = document.querySelector("#upperCase");
const lowercaseCheckbox = document.querySelector("#lowerCase");
const numberCheckbox = document.querySelector("#Numbers");
const symbolCheckbox = document.querySelector("#Symbol");
const indicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector("[data-generateButton]");
const allCheckbox = document.querySelectorAll ("input[type=checkbox]");
const symbol = '!@#"$%^&*=+-_(){}[]: /?.>,<|\ ';


let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//Strength circle color to grey   

setIndicator("#ccc")

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "%100"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}` ; // Shadow
}


function generateRandomInteger(min,max){
    return Math.floor(Math.random()*(max - min)+min);

}

function generateRandomNumber(){

     return generateRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(generateRandomInteger(97,123))
}

function generateUpperCase(){
    return String.fromCharCode(generateRandomInteger(65,91))
}

function generateSymbol(){
    const randNum = generateRandomInteger(0,symbol.length);
    return symbol.charAt(randNum); 
}

function calStrength(){
    let hasUpper = false;
    let hasLower  = false;
    let hasNum = false;
    let hasSyn = false;
    if(uppercaseCheckbox.checked) hasUpper = true;
    if(lowercaseCheckbox.checked) hasLower = true;
    if(numberCheckbox.checked) hasNum = true;
    if(symbolCheckbox.checked) hasSyn = true;

    if(hasUpper && hasLower && (hasNum || hasSyn) && passwordLength>=8){
        setIndicator("#0f0");
    }else if(
        (hasLower || hasUpper )&& (hasNum || hasSyn) && passwordLength>=6
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
  await navigator.clipboard.writeText(passwordDisplay.value);
  copyMessage.innerText = "copied";
    }
    catch(e){
  copyMessage.innerText = "failed";
    }
  //To make copy span tag visible
  copyMessage.classList.add("active");

  setTimeout(() =>{
    copyMessage.classList.remove("active");
  },2000);

}
function shufflePassword(array){
    //Fisher Yates Method
    for(let i = array.length-1;i>0;i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str+=el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckbox.forEach((checkbox) => {
        if(checkbox.checked)
        checkCount++;
    } );

    //special condition
    if(passwordLength< checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

copyButton.addEventListener('click', () => {
    if(passwordDisplay.value)
    copyContent();
})

generateButton.addEventListener('click',() => {
//None of the checkbox are selected
if(checkCount<=0) return;

if(passwordLength<checkCount){
    passwordLength = checkCount;
    handleSlider();
}

//Let's start the journey to find new password

//remove old password

password = "";

//let's put the stuff mentioned by checkbox


let funcArr = [];

if(uppercaseCheckbox.checked){
 funcArr.push(generateUpperCase);
}
 if(lowercaseCheckbox.checked){
 funcArr.push(generateLowerCase);

 }
 if(numberCheckbox.checked){
 funcArr.push(generateRandomNumber);
 }

 if(symbolCheckbox.checked){
 funcArr.push(generateSymbol);
 }
 //Compulsory addition
 for(let i = 0;i<funcArr.length;i++){
    password+= funcArr[i]();
 }
 console.log("Compulsory addition done");

 //Remaining addition
 for(let i = 0;i<passwordLength - funcArr.length;i++){
    let randIndex = generateRandomInteger(0,funcArr.length);
    password += funcArr[randIndex]();
 }
 console.log("Remainig addition done");

 //shuffle the password  
 password = shufflePassword(Array.from(password));
 console.log("Shuffling addition done");

 //Show in UI

 passwordDisplay.value = password;
 console.log("UI addition done");

//calculate strength
calStrength();


})