/****************** Global Variables ********************/
let url = 'https://fakestoreapi.com/products';//api products
let quantityProducts = 12;//how many items to show

let products = [quantityProducts];//array of object from Catalog Class
let itemsArray = [quantityProducts];

let tablet = document.querySelector('#tableProducts');//empty table to keep products 'Cart Products'

let TotalAmountBeforeTaxes = 0;//total to pay before taxes and shipping

let convertionValue = 1;//initialize convertion value before get actual value from the API
let currencySymbol = "C$";//initialize currency simbol

let cardNumberValidated = "";//card number already validated
let monthCard = "";//monthCard already validated
let yearCard = "";//yearCard already validated
let cvcCard = "";//cvcCard already validated
let currentMonth = 8;//august use to accept experation date only from current month
let BooleanPaymentMethod = false;

let firstNameValidated="";
let lastNameValidated="";
let addressValidated="";
let cityValidated="";
let provinceValidated="";
let countryValidated="";
let postalCodeValidated="";
let phoneValidated="";
let emailValidated="";
let BooleanBillingMethod = false;

let firstNameValidatedShipping="";
let lastNameValidatedShipping="";
let addressValidatedShipping="";
let cityValidatedShipping="";
let provinceValidatedShipping="";
let countryValidatedShipping="";
let postalCodeValidatedShipping="";
let BooleanBillingMethodShipping = false;

let shippingFee = 15;
let taxFee = 0;
let orderTotal = 0;

let itemsString="";

//disable emptyCartButton and chekoutCartButton from the start
document.getElementById("emptyCartButton").disabled = true;
document.getElementById("checkoutCartButton").disabled = true;

fetch(url)
        .then(response => response.json())
        .then(data =>{
        //bootstrap creation of products
            
            let container = document.querySelector('#products');
            for(let i = 0 ; i < quantityProducts ; i++){
                
                //Create array "products" of object from Catalog class with data from API
                products[i] = new Catalog(`${data[i].image}`,`${data[i].title}`,`${data[i].description}`,`${data[i].price}`);
               
                //show products from array in <div id="products">
                
                container.innerHTML += `<div class="card text-end" style="width: 18rem;">
                <div class="card-body container">
                  <div class="row d-flex justify-content-center">
                    <img src = "${products[i].img}" alt="imagen" style="width:200px; height:250px">
                  </div>
                  <div class="row">
                    <h5 class="card-title">${products[i].title}</h5>
                  </div>
                  <div class="row">
                    <p class="card-text">${products[i].description}</p>
                  </div>
                  <div class="row d-flex mt-5">
                    <div class="col-6">
                      <p id = "precioCatalog${i}" class="precio">${currencySymbol} ${((products[i].price)*convertionValue).toFixed(2)}</p>
                    </div>
                    <div class="col-6 ">
                      <button id = "btn${i}" data-id="${i}" type="button" class="btnAddToCart btn btn-success" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>`;
            }
           
            
            

            //EventListener for each button "add to Cart"
            for (let i = 0; i < quantityProducts; i++) {
              let btn = document.getElementById(`btn${i}`);

              btn.addEventListener('click', function () {
               
                var product_id = $(this).attr("data-id"); 
                var cart_items = get_cookie("shopping_cart_items"); // get the data stored as a "cookie"
                
                // initialize the cart items if it returns null
                if (cart_items === null) {
                    cart_items = {};
                }

                // make sure the object is defined;
                if (cart_items[product_id] === undefined) {
                    cart_items[product_id] = 0;
                }

                cart_items[product_id]++;

                set_cookie("shopping_cart_items", cart_items);

                TotalAmountBeforeTaxes = 0;
                updateCart(cart_items);
               
              });
            }
              
            //showCart button funcionality
              let btnShow = document.getElementById("showCart");
              btnShow.addEventListener('click',function(){
                TotalAmountBeforeTaxes = 0;
                var cart = get_cookie("shopping_cart_items");
                updateCart(cart);

              });
              
            //emptyCartButton funcionality
              let btnEmpty = document.getElementById("emptyCartButton");
              btnEmpty.addEventListener('click',function(){
                
                let cart = {}
                set_cookie("shopping_cart_items", cart);
                TotalAmountBeforeTaxes = 0;
                
                updateCart(cart);


              });

      
        } );//end Fecth()

      
    /* =================================================== */

  function updateCart(cart_items){

    tablet.innerHTML = ``;

    for(let i = 0 ; i < quantityProducts; i++){
      if(cart_items[i] > 0){
        
        let Total = ((products[i].price)*convertionValue).toFixed(2) * cart_items[i];
        TotalAmountBeforeTaxes += Total;
        tablet.innerHTML += `<tr>
        <th scope="row"><img id = "imgCan${i}" data-id="${i}" src = "trash.svg" alt="imagen" style="width:15px"></th>
        <td style="width:30%">${products[i].title}</td>
        <td>${cart_items[i]}</td>
        <td>${currencySymbol} ${((products[i].price)*convertionValue).toFixed(2)}</td>
        <td>${currencySymbol} ${Total}</td>
        </tr>`;
        
        document.getElementById("emptyCartButton").disabled = false;
        document.getElementById("checkoutCartButton").disabled = false;

      }
      

    
    }
    if(TotalAmountBeforeTaxes == 0){
      document.getElementById("emptyCartButton").disabled = true;
      document.getElementById("checkoutCartButton").disabled = true;
    }

    document.getElementById("TotalAmountBeforeTaxes").innerHTML = `${currencySymbol} ${TotalAmountBeforeTaxes.toFixed(2)}`;
    
    loadTrashCanFuncionality();

  }

  function loadTrashCanFuncionality(){

    //EventListener for each button "Trash Icon"
    let cartForTrash = get_cookie("shopping_cart_items");
    
    for (let i = 0; i < quantityProducts; i++) {

      if(cartForTrash[i]){
        let btn = document.getElementById(`imgCan${i}`);
        
        btn.addEventListener('click', function () {
          var product_id = $(this).attr("data-id"); 
          
          
          if(cartForTrash[product_id])
            cartForTrash[product_id]--;

          set_cookie("shopping_cart_items", cartForTrash);
          TotalAmountBeforeTaxes = 0;
          updateCart(cartForTrash);
     
        });
   
      }
    }

  }

// **************** Functions to change currency *****************
const currencySelect = document.getElementById("currencySelect");
currencySelect.addEventListener('change',function(){
    const selectedValue = currencySelect.value;
    if(selectedValue == 1){change_to_CAD();    
    }else  if(selectedValue == 2){change_to_USD();    
    }else  if(selectedValue == 3){change_to_ENG();}
});


  function change_to_CAD(){
    let url2 = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/cad.json';
    fetch(url2)
      .then(response => response.json())
      .then(data =>{
    
    // Obtener la tasa de conversión de CAD desde los datos obtenidos
    
    convertionValue = data.cad.cad;
    console.log(convertionValue);
    updateCatalogAfterCurrency();
   
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

    currencySymbol = "C$";
    
  }

  function change_to_USD(){
    let url2 = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/cad.json';
    fetch(url2)
      .then(response => response.json())
      .then(data =>{
    
    // Obtener la tasa de conversión de CAD desde los datos obtenidos
    
    convertionValue = data.cad.usd;
    console.log(convertionValue);
    updateCatalogAfterCurrency();
   
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

    currencySymbol = "USD$";
    
  }

  function change_to_ENG(){
    let url2 = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/cad.json';
    fetch(url2)
      .then(response => response.json())
      .then(data =>{
    
    // Obtener la tasa de conversión de CAD desde los datos obtenidos
    
    convertionValue = data.cad.gbp;
    console.log(convertionValue);
    updateCatalogAfterCurrency();
   
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
    currencySymbol = "£";
    
  }
function updateCatalogAfterCurrency(){

  
  for (let i = 0; i < quantityProducts; i++) {
    let precioCatalog = document.getElementById(`precioCatalog${i}`);

    precioCatalog.innerHTML = currencySymbol+" "+((products[i].price)*convertionValue).toFixed(2);

  }
}


// ***************** Function related with the Forms **************************** //


let formulario = document.getElementById("formulario");

let checkoutCartButton = document.getElementById("checkoutCartButton");
checkoutCartButton.addEventListener('click',functionbtnf1);

//Payment Method Form
let btnf1 = document.getElementById("btnf1");
btnf1.addEventListener('click',functionbtnf1);

let btnf2 = document.getElementById("btnf2");
btnf2.addEventListener('click',functionbtnf2);

let btnf3 = document.getElementById("btnf3");
btnf3.addEventListener('click',functionbtnf3);

let btnf4 = document.getElementById("btnf4");
btnf4.addEventListener('click',functionbtnf4);

//Payment Method Form developed
function functionbtnf1(){

  formulario.innerHTML = `
  <br><h4>Payment Method</h4><br>
  <form class="form-floating">
    <div class="container">

      <div class="row">
        <label>Card Number</label>
        <input type="input" class="form-control" id="CardNumber" maxlength="20" placeholder="" value=${cardNumberValidated}>
      </div>
    
      <div class="row mt-2">
        <div class = "col">
          <label>Expiration Date</label>
          <input type="input" class="form-control" id="monthSelected" maxlength="2" placeholder="" value=${monthCard}>
         
        </div>
        <div class = "col mt-4">
          <input type="input" class="form-control" id="selectYear" maxlength="4" placeholder="" value=${yearCard}>
         
        </div>
        <div class = "col">
          <label>Security Code</label>
          <input type="input" class="form-control" id="cvc" maxlength="3"placeholder="" value="${cvcCard}">
        </div>
      </div>

    </div>

  </form>
  <div class="d-grid gap-2 d-md-flex justify-content-md-end">
    <button id= "btnValidate01" type="button" class="btn btn-success">Validate</button>
    
  </div>
  `;

  btnf1.className="nav-link active";
  btnf2.className="nav-link";
  btnf3.className="nav-link";
  btnf4.className="nav-link";

  btnf1.style = "background-color:blue; color:white";
  btnf2.style = "background-color:white; color:blue";
  btnf3.style = "background-color:white; color:blue";
  btnf4.style = "background-color:white; color:blue";

  
 
  checkFormValidated01(BooleanPaymentMethod);
  
  //==============Continue Button that valides form Checkout page 01 ======================== //
  let btnValidate01 = document.getElementById("btnValidate01");
  btnValidate01.addEventListener('click',function(){

    let flagPaymenthMethod = 0; //gets to 3 if all the form is correct
    //validate card number

    const numeroTarjetaInput = document.getElementById("CardNumber");
    const numeroTarjeta = numeroTarjetaInput.value.replace(/\s/g, ''); 
    
    const patron = /^4111111111111111$/;

    if (patron.test(numeroTarjeta)) {
        
        document.getElementById('CardNumber').style="border: solid green; background-color:#E0F7D9";
        
        cardNumberValidated = numeroTarjeta;
        flagPaymenthMethod ++;
    } else {
        
        document.getElementById('CardNumber').style="border: solid red; background-color:#F5DAE8";
    }

    //valide month and year
    
    const inputMonth = document.getElementById("monthSelected");
    const valorMonth = inputMonth.value;

    const patron3 = /^(?:[1-9]|1[0-2])$/;

    const inputYear = document.getElementById("selectYear");
    const valorYear = inputYear.value;

    const patron4 = /^(202[3-9]|2030)$/;



    if (patron3.test(valorMonth)&&(valorMonth<currentMonth)&&(patron4.test(valorYear))) {
      
      document.getElementById("monthSelected").style="border: solid red; background-color:#F5DAE8";
    }else if (patron3.test(valorMonth)&&(patron4.test(valorYear)))  {

      document.getElementById("monthSelected").style="border: solid green; background-color:#E0F7D9";
      document.getElementById("selectYear").style="border: solid green; background-color:#E0F7D9";
      monthCard = valorMonth;
      yearCard = valorYear;
      flagPaymenthMethod ++;
    }else{
      document.getElementById("monthSelected").style="border: solid red; background-color:#F5DAE8";
      document.getElementById("selectYear").style="border: solid red; background-color:#F5DAE8";
    }
        
   

    //validate CVC
    const input = document.getElementById("cvc");
    const valor = input.value;

    // Expresión regular para verificar que el valor sea un número de 3 dígitos
    const patron2 = /^\d{3}$/;

    if (patron2.test(valor)) {
        
        document.getElementById("cvc").style="border: solid green; background-color:#E0F7D9";
        cvcCard = valor;
        flagPaymenthMethod ++;
    } else {
        document.getElementById("cvc").style="border: solid red; background-color:#F5DAE8";
    }

    if(flagPaymenthMethod == 3){
      
      BooleanPaymentMethod = true;

    }else{
      BooleanPaymentMethod = false;

    }

  

  });//=============end of Continue button

  

}

function functionbtnf2(){

  formulario.innerHTML = `
  <br><h4>Billing Information</h4><br>
  <form class="form-floating">
    <div class="container">

      <div class="row">
        <div class = "col">
          <label>First Name</label>
          <input type="input" class="form-control" id="firstName" maxlength="30" placeholder="" value=${firstNameValidated}>
        </div>
        <div class = "col">
          <label>Last Name</label>
          <input type="input" class="form-control" id="lastName" maxlength="30" placeholder="" value=${lastNameValidated}>
        </div>
      </div>

      <div class="row">
        <label>Billing Address</label>
        <input type="input" class="form-control" id="billingAddress" placeholder="" value="${addressValidated}">
      </div>
    
      <div class="row">
        <div class = "col">
          <label>City</label>
          <input type="input" class="form-control" id="city" placeholder="" value="${cityValidated}">
        </div>
        <div class = "col">
          <label>Province/State</label>
          <input type="input" class="form-control" id="province" placeholder="" value="${provinceValidated}">
        </div>
      </div>

      <div class="row">
        <div class = "col">
          <label>Country</label>
          <input type="input" class="form-control" id="country" placeholder="" value="${countryValidated}">
        </div>
        <div class = "col">
          <label>Postal Code/ZIP</label>
          <input type="input" class="form-control" id="postalCode" placeholder="" value="${postalCodeValidated}">
        </div>
      </div>

      <div class="row">
        <label>Phone</label>
        <input type="input" class="form-control" id="phone" placeholder="" value="${phoneValidated}">
      </div>

      <div class="row">
        <label>Email Address</label>
        <input type="input" class="form-control" id="email" placeholder="" value="${emailValidated}">
      </div>
    </div>

  </form>
  <div class="d-grid gap-2 d-md-flex justify-content-md-end">
    <button id= "btnValidate02" type="button" class="btn btn-success">Validate</button>
    
  </div>

  `;

  btnf1.className="nav-link";
  btnf2.className="nav-link active";
  btnf3.className="nav-link";
  btnf4.className="nav-link";

  btnf1.style = "background-color:white; color:blue";
  btnf2.style = "background-color:blue; color:white";
  btnf3.style = "background-color:white; color:blue";
  btnf4.style = "background-color:white; color:blue";

  checkFormValidated02(BooleanBillingMethod);
  
  //==============Continue Button that valides form Checkout page 02 ======================== //
  let btnValidate02 = document.getElementById("btnValidate02");
  btnValidate02.addEventListener('click',function(){

    flagBillingMethod = 0;//gets to 9 when all the form is validated
        
    //validate first name and last name

    const inputName = document.getElementById("firstName");
    const valorName = inputName.value;

    const inputLastName = document.getElementById("lastName");
    const valorLastName = inputLastName.value;

    const patron5 = /^[a-zA-Z]+$/;//valid name or lastname

    if (patron5.test(valorName)){
      document.getElementById("firstName").style="border: solid green; background-color:#E0F7D9";
          firstNameValidated = valorName;
          flagBillingMethod ++;

    }else{
      document.getElementById("firstName").style="border: solid red; background-color:#F5DAE8";
    }

    if (patron5.test(valorLastName)){
      document.getElementById("lastName").style="border: solid green; background-color:#E0F7D9";
          lastNameValidated = valorLastName;
          flagBillingMethod ++;

    }else{
      document.getElementById("lastName").style="border: solid red; background-color:#F5DAE8";
    }

    //validate address
    
    let inputAddress = document.getElementById("billingAddress");
    let valorAddress = inputAddress.value;

    if(valorAddress==""){
      document.getElementById("billingAddress").style="border: solid red; background-color:#F5DAE8";
    }else{
      document.getElementById("billingAddress").style="border: solid green; background-color:#E0F7D9";
      addressValidated = valorAddress;
      flagBillingMethod ++;
    }

    //validate City
    
    let inputCity = document.getElementById("city");
    let valorCity = inputCity.value;

    if((valorCity=="")||(patron5.test(valorCity)==false)){
      document.getElementById("city").style="border: solid red; background-color:#F5DAE8";
    }else{
      document.getElementById("city").style="border: solid green; background-color:#E0F7D9";
      cityValidated = valorCity;
      flagBillingMethod ++;
    }

    //validate Province
    
    let inputProvince = document.getElementById("province");
    let valorProvince = inputProvince.value;

    if((valorProvince=="")||(patron5.test(valorProvince)==false)){
      document.getElementById("province").style="border: solid red; background-color:#F5DAE8";
    }else{
      document.getElementById("province").style="border: solid green; background-color:#E0F7D9";
      provinceValidated = valorProvince;
      flagBillingMethod ++;
    }

    //validate Country
    
    let inputCountry = document.getElementById("country");
    let valorCountry = inputCountry.value;

    if((valorCountry=="")||(patron5.test(valorCountry)==false)){
      document.getElementById("country").style="border: solid red; background-color:#F5DAE8";
    }else{
      document.getElementById("country").style="border: solid green; background-color:#E0F7D9";
      countryValidated = valorCountry;
      flagBillingMethod ++;
    }

    //validate Postal Code
    
    let inputPostal = document.getElementById("postalCode");
    let valorPostal = inputPostal.value;
    let patterPostalCode = /^[ABCEGHJKLMNPRSTVXY]\d[A-Za-z] ?\d[A-Za-z]\d$/i;

    if((valorPostal=="")||(patterPostalCode.test(valorPostal)==false)){
      document.getElementById("postalCode").style="border: solid red; background-color:#F5DAE8";
    }else{
      document.getElementById("postalCode").style="border: solid green; background-color:#E0F7D9";
      postalCodeValidated = valorPostal;
      flagBillingMethod ++;
    }

    //validate phone
    let inputPhone = document.getElementById("phone");
    let valorPhone = inputPhone.value;
    let patternPhoneNumber = /^(\d{3}[-\s]?\d{3}[-\s]?\d{4})$/;

    if((valorPhone=="")||(patternPhoneNumber.test(valorPhone)==false)){
      document.getElementById("phone").style="border: solid red; background-color:#F5DAE8";
    }else{
      document.getElementById("phone").style="border: solid green; background-color:#E0F7D9";
      phoneValidated = valorPhone;
      flagBillingMethod ++;
    }
       
    //validate email
    let inputEmail = document.getElementById("email");
    let valorEmail = inputEmail.value;
    let patternArrobaEmail = /@/;
    let patternPointEmail = /\../;

    if((valorEmail=="")||(patternArrobaEmail.test(valorEmail)==false)||(patternPointEmail.test(valorEmail)==false)){
      document.getElementById("email").style="border: solid red; background-color:#F5DAE8";
    }else{
      document.getElementById("email").style="border: solid green; background-color:#E0F7D9";
      emailValidated = valorEmail;
      flagBillingMethod ++;
    }

    if(flagBillingMethod == 9){
      
      BooleanBillingMethod = true;

    }else{
      BooleanBillingMethod = false;

    }

  });//=============end of Continue button

  

}
function functionbtnf3(){
  formulario.innerHTML = `
  <br><h4>Shipping Information</h4><br>
  <form class="form-floating">
    <div class="container">

      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
        <label class="form-check-label" for="flexCheckChecked">Shopping Information is the same as Blling Details
        </label>
      </div>
      <div class="row">
        <div class = "col">
          <label>First Name</label>
          <input type="input" class="form-control" id="firstNameShipping" maxlength="30" placeholder="" value=${firstNameValidatedShipping}>
        </div>
        <div class = "col">
          <label>Last Name</label>
          <input type="input" class="form-control" id="lastNameShipping" maxlength="30" placeholder="" value=${lastNameValidatedShipping}>
        </div>
      </div>

      <div class="row">
        <label>Billing Address</label>
        <input type="input" class="form-control" id="billingAddressShipping" placeholder="" value="${addressValidatedShipping}">
      </div>
    
      <div class="row">
        <div class = "col">
          <label>City</label>
          <input type="input" class="form-control" id="cityShipping" placeholder="" value="${cityValidatedShipping}">
        </div>
        <div class = "col">
          <label>Province/State</label>
          <input type="input" class="form-control" id="provinceShipping" placeholder="" value="${provinceValidatedShipping}">
        </div>
      </div>

      <div class="row">
        <div class = "col">
          <label>Country</label>
          <input type="input" class="form-control" id="countryShipping" placeholder="" value="${countryValidatedShipping}">
        </div>
        <div class = "col">
          <label>Postal Code/ZIP</label>
          <input type="input" class="form-control" id="postalCodeShipping" placeholder="" value="${postalCodeValidatedShipping}">
        </div>
      </div>

      
    </div>

      </form>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button id= "btnValidate03" type="button" class="btn btn-success">Validate</button>
        
      </div>

  `;
  btnf1.className="nav-link";
  btnf2.className="nav-link";
  btnf3.className="nav-link active";
  btnf4.className="nav-link";

  btnf1.style = "background-color:white; color:blue";
  btnf2.style = "background-color:white; color:blue";
  btnf3.style = "background-color:blue; color:white";
  btnf4.style = "background-color:white; color:blue";


  // checkbox Activated
  let checkbox = document.getElementById("flexCheckChecked");
  checkbox.addEventListener("change", function(){

    let check = document.getElementById("flexCheckChecked");
    if (check.checked) {
      
      document.getElementById('firstNameShipping').value=firstNameValidated;
      document.getElementById('lastNameShipping').value=lastNameValidated;
      document.getElementById('billingAddressShipping').value=addressValidated;
      document.getElementById('cityShipping').value=cityValidated;
      document.getElementById('provinceShipping').value=provinceValidated;
      document.getElementById('countryShipping').value=countryValidated;
      document.getElementById('postalCodeShipping').value=postalCodeValidated;
      
      
    } else {
      
      document.getElementById('firstNameShipping').value="";
      document.getElementById('lastNameShipping').value="";
      document.getElementById('billingAddressShipping').value="";
      document.getElementById('cityShipping').value="";
      document.getElementById('provinceShipping').value="";
      document.getElementById('countryShipping').value="";
      document.getElementById('postalCodeShipping').value="";
      
    }

  });

  checkFormValidated03(BooleanBillingMethodShipping);
  //==============Continue Button that valides form Checkout page 03 ======================== //
  let btnValidate03 = document.getElementById("btnValidate03");
  btnValidate03.addEventListener('click',function(){

    flagBillingMethodShipping = 0;//gets to 7 when all the form is validated
        
    //validate first name and last name

    const inputName = document.getElementById("firstNameShipping");
    const valorName = inputName.value;

    const inputLastName = document.getElementById("lastNameShipping");
    const valorLastName = inputLastName.value;

    const patron5 = /^[a-zA-Z]+$/;//valid name or lastname

    if (patron5.test(valorName)){
      document.getElementById("firstNameShipping").style="border: solid green; background-color:#E0F7D9";
          firstNameValidatedShipping = valorName;
          flagBillingMethodShipping ++;

    }else{
      document.getElementById("firstNameShipping").style="border: solid red; background-color:#F5DAE8";
    }

    if (patron5.test(valorLastName)){
      document.getElementById("lastNameShipping").style="border: solid green; background-color:#E0F7D9";
          lastNameValidatedShipping = valorLastName;
          flagBillingMethodShipping ++;

    }else{
      document.getElementById("lastNameShipping").style="border: solid red; background-color:#F5DAE8";
    }

    //validate address
    
    let inputAddress = document.getElementById("billingAddressShipping");
    let valorAddress = inputAddress.value;

    if(valorAddress==""){
      document.getElementById("billingAddressShipping").style="border: solid red; background-color:#F5DAE8";
    }else{
      document.getElementById("billingAddressShipping").style="border: solid green; background-color:#E0F7D9";
      addressValidatedShipping = valorAddress;
      flagBillingMethodShipping ++;
    }

    //validate City
    
    let inputCity = document.getElementById("cityShipping");
    let valorCity = inputCity.value;

    if((valorCity=="")||(patron5.test(valorCity)==false)){
      document.getElementById("cityShipping").style="border: solid red; background-color:#F5DAE8";
    }else{
      document.getElementById("cityShipping").style="border: solid green; background-color:#E0F7D9";
      cityValidatedShipping = valorCity;
      flagBillingMethodShipping ++;
    }

    //validate Province
    
    let inputProvince = document.getElementById("provinceShipping");
    let valorProvince = inputProvince.value;

    if((valorProvince=="")||(patron5.test(valorProvince)==false)){
      document.getElementById("provinceShipping").style="border: solid red; background-color:#F5DAE8";
    }else{
      document.getElementById("provinceShipping").style="border: solid green; background-color:#E0F7D9";
      provinceValidatedShipping = valorProvince;
      flagBillingMethodShipping ++;
    }

    //validate Country
    
    let inputCountry = document.getElementById("countryShipping");
    let valorCountry = inputCountry.value;

    if((valorCountry=="")||(patron5.test(valorCountry)==false)){
      document.getElementById("countryShipping").style="border: solid red; background-color:#F5DAE8";
    }else{
      document.getElementById("countryShipping").style="border: solid green; background-color:#E0F7D9";
      countryValidatedShipping = valorCountry;
      flagBillingMethodShipping ++;
    }

    //validate Postal Code
    
    let inputPostal = document.getElementById("postalCodeShipping");
    let valorPostal = inputPostal.value;
    let patterPostalCode = /^[ABCEGHJKLMNPRSTVXY]\d[A-Za-z] ?\d[A-Za-z]\d$/i;

    if((valorPostal=="")||(patterPostalCode.test(valorPostal)==false)){
      document.getElementById("postalCodeShipping").style="border: solid red; background-color:#F5DAE8";
    }else{
      document.getElementById("postalCodeShipping").style="border: solid green; background-color:#E0F7D9";
      postalCodeValidatedShipping = valorPostal;
      flagBillingMethodShipping ++;
    }

    
       
    

    if(flagBillingMethodShipping == 7){
      
      BooleanBillingMethodShipping = true;
      

    }else{
      BooleanBillingMethodShipping = false;

    }

  });//=============end of Continue button
    


}

function functionbtnf4(){

  let formulario = document.getElementById("formulario");
  formulario.innerHTML = `
  <br><h4>Order Details</h4><br>
  <table class="table">
  <thead>
    <tr>
      <th >Item</th>
      <th >Qty</th>
      <th >Price</th>
      <th >Total</th>
    </tr>
  </thead>
  <tbody class="table-group-divider" id = "cartProductsDetails">
    
    <!--
    
    <tr>
      <th>Shipping</th>
      <td></td>
      <td></td>
      <td>000</td>
    </tr>
    <tr>
      <th>Tax</th>
      <td></td>
      <td></td>
      <td>000</td>
    </tr>
    <tr>
      <th>Order Total</th>
      <td></td>
      <td></td>
      <td>000</td>
    </tr>
    -->

      </tbody>
    </table>
    <div id="errorMsg" style="color:red">Complete the form tu activated the button</div>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button id= "btnCompleteOrder" type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModalFinal">Complete Order now</button>
        
    </div>
  
  `;
  
  document.getElementById("btnCompleteOrder").disabled=true;
  btnf1.className="nav-link";
  btnf2.className="nav-link ";
  btnf3.className="nav-link";
  btnf4.className="nav-link active";

  btnf1.style = "background-color:white; color:blue";
  btnf2.style = "background-color:white; color:blue";
  btnf3.style = "background-color:white; color:blue";
  btnf4.style = "background-color:blue; color:white";

  //Load data from the cart 
  var cart_items_final = get_cookie("shopping_cart_items");
  let tabletRow1 = document.getElementById("cartProductsDetails");

  for(let i = 0 ; i < quantityProducts; i++){
    if(cart_items_final[i] > 0){
      let Total = ((products[i].price)*convertionValue).toFixed(2) * cart_items_final[i];
      tabletRow1.innerHTML += `
      <tr>
        <th style="font-weight:normal">${products[i].title}</th>
        <td style="font-weight:normal">${cart_items_final[i]}</td>
        <td style="font-weight:normal">${currencySymbol} ${((products[i].price)*convertionValue).toFixed(2)}</td>
        <td style="font-weight:normal">${currencySymbol} ${Total}</td>
      </tr>
     
      `;
    
    }
  
  }

  taxFee=TotalAmountBeforeTaxes*0.05;
  orderTotal=TotalAmountBeforeTaxes+shippingFee+taxFee;

  tabletRow1.innerHTML += `
      <tr>
        <th>Subtotal</th>
        <td></td>
        <td></td>
        <td style="font-weight:bold">${currencySymbol} ${TotalAmountBeforeTaxes.toFixed(2)}</td>
      </tr>
      <tr>
        <th>Shipping</th>
        <td></td>
        <td></td>
        <td style="font-weight:bold">${currencySymbol} ${(shippingFee*convertionValue).toFixed(2)}</td>
      </tr>
      <tr>
        <th>Tax</th>
        <td></td>
        <td></td>
        <td style="font-weight:bold">${currencySymbol} ${(taxFee*convertionValue).toFixed(2)}</td>
      </tr>
      <tr>
        <th>Order Total</th>
        <td></td>
        <td></td>
        <td style="font-weight:bold; color:green">${currencySymbol} ${(orderTotal*convertionValue).toFixed(2)}</td>
      </tr>
  `;
 

 

  if(BooleanPaymentMethod&&BooleanBillingMethod&&BooleanBillingMethodShipping){
    document.getElementById("btnCompleteOrder").disabled=false;
   
    document.getElementById("errorMsg").innerHTML="";
    loadItemsForJsonObject();
    sentJasonObject();

  }else{
    document.getElementById("btnCompleteOrder").disabled=true;
  }




}

function checkFormValidated01(value){

  if(value){
    document.getElementById('CardNumber').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('monthSelected').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('selectYear').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('cvc').style="border: solid green; background-color:#E0F7D9";
  }
}
function checkFormValidated02(value){

  if(value){
    document.getElementById('firstName').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('lastName').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('billingAddress').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('city').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('province').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('country').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('postalCode').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('phone').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('email').style="border: solid green; background-color:#E0F7D9";
  }
}

function checkFormValidated03(value){

  if(value){
    document.getElementById('firstNameShipping').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('lastNameShipping').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('billingAddressShipping').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('cityShipping').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('provinceShipping').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('countryShipping').style="border: solid green; background-color:#E0F7D9";
    document.getElementById('postalCodeShipping').style="border: solid green; background-color:#E0F7D9";
    
  }
}

function loadItemsForJsonObject(){
  itemsArray = [
    { name: '', qty: 0, price: 0, total: 2 },
    { name: '', qty: 0, price: 0, total: 2 },
    { name: '', qty: 0, price: 0, total: 2 },
    { name: '', qty: 0, price: 0, total: 2 },
    { name: '', qty: 0, price: 0, total: 2 },
    { name: '', qty: 0, price: 0, total: 2 },
    { name: '', qty: 0, price: 0, total: 2 },
    { name: '', qty: 0, price: 0, total: 2 },
    { name: '', qty: 0, price: 0, total: 2 },
    { name: '', qty: 0, price: 0, total: 2 },
    { name: '', qty: 0, price: 0, total: 2 },
    { name: '', qty: 0, price: 0, total: 2 }
   
  ];


  var cart_items_final = get_cookie("shopping_cart_items");
  let ind=0;
  for(let i = 0 ; i < quantityProducts; i++){
    
    if(cart_items_final[i] > 0){
      let Total = ((products[i].price)*convertionValue).toFixed(2) * cart_items_final[i];
      
      
      itemsArray[ind].name=products[i].title;
      itemsArray[ind].qty=cart_items_final[i];
      itemsArray[ind].price=(products[i].price*convertionValue).toFixed(2);
      itemsArray[ind].total=Total;
      ind++;

    }
  }
  
}

function sentJasonObject(){
    // Datos del formulario
    const formData = {
      card_number: cardNumberValidated,
      expiry_month: monthCard,
      expiry_year: yearCard,
      security_code: cvcCard,
      amount: orderTotal,
      taxes: taxFee,
      shipping_amount: shippingFee,
      currency: currencySymbol,
      items: { 
        itemsArray
       
      },
      billing: {
        first_name: firstNameValidated,
        last_name: lastNameValidated,
        address_1: addressValidated,
        address_2: 'Second Street Info [Optional]',
        city: cityValidated,
        province: provinceValidated,
        country: countryValidated,
        postal: postalCodeValidated,
        phone: phoneValidated,
        email: emailValidated
      },
      shipping: {
        first_name: firstNameValidatedShipping,
        last_name: lastNameValidatedShipping,
        address_1: addressValidatedShipping,
        address_2: 'Second Street Info [Optional]',
        city: cityValidatedShipping,
        province: provinceValidatedShipping,
        country: countryValidatedShipping,
        postal: postalCodeValidatedShipping
      }
    };

    // URL 
    const url = 'https://deepblue.camosun.bc.ca/~c0180354/ics128/final/';

    // setting POST
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    };

    
    // Post request
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log('Respuesta del servidor:', data);
        // Aquí puedes manejar la respuesta del servidor si es necesario
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
        // Manejar el error en caso de que la solicitud falle
      });
    

      //console.log(formData);
      
  
}