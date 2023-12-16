const currentPage = document.getElementById("current-page");
const cartContainerLeft = document.getElementsByClassName("cart-container-left")[0];
const cartContainerRight = document.getElementsByClassName("cart-container-right")[0];
let totalAmount = 0;

// get userdata from LS
function getUsersDataState(){
  return JSON.parse(localStorage.getItem("usersData")) || null;
}

// get userEmails from LS
function getUserEmailsState(){
  return JSON.parse(localStorage.getItem("userEmails")) || null;
}

function setCurrentPage(name){
    localStorage.setItem("currentPage",JSON.stringify(name))
}
  
function getCurrentPage(){
    return JSON.parse(localStorage.getItem("currentPage"));
}

function getCartItems(){
  return JSON.parse(localStorage.getItem("cart")) || null;
}

function displayDataOnCart(){

  cartContainerLeft.innerHTML = "";

  let cart = getCartItems();

  cart.forEach(product => {

    const arr = product.colours.map(color => color.toLowerCase()) ;

    const div = document.createElement("div");
    div.setAttribute("class","item-colors");

    arr.forEach(color => {
        const span = document.createElement("span");
        span.setAttribute("class",`${color}`);
        div.append(span);
    })


    const itemStar = document.createElement("div");
    itemStar.setAttribute("class","item-stars");
    
    let rating = product.rating.rate;

    // logic for rating items using boxicon stars
    for(let i = 0; i < Math.ceil(rating); i++){
        
        if(i + 1 === Math.ceil(rating)){
            if(rating !== Math.ceil(rating)){
                const span = document.createElement("span");
                span.innerHTML = `<i class='bx bxs-star-half star' ></i>`;
                itemStar.append(span);
                break;
            }
        }
        
        const span = document.createElement("span");
        span.innerHTML = `<i class='bx bxs-star star' ></i>`; 
        itemStar.append(span);
    }


    const item = document.createElement("div");
    item.setAttribute("class","item");
    item.setAttribute("id",product.id)
    item.innerHTML = `  <img src="${product.image}" alt="item image">
    <div class="title">
    <p>${product.title}</p>
    </div>
    <div class="item-price-and-size">
        <p class="item-price"><b>Price:</b> ₹${product.price}</p>
        <p class="item-size"><b>Sizes:</b> ${product.sizes[0]}</p>
    </div>
    <div class="item-colors-container">
        <h4>Colors :</h4> 
    </div>
    <div class="item-rating">
        <h4>Rating :</h4>
    </div>
    <button class="remove-from-cart-btn" onclick = "removeFromCart(${product.id})">Remove From Cart</button>`

    item.children[3].append(div);

    item.children[4].append(itemStar);

    cartContainerLeft.append(item);

  })

}

function displayCheckoutList(){
    const cart = getCartItems();

    let totalPriceValue = 0;

    let count = 1;


    cartContainerRight.innerHTML = "";

    const checkoutList = document.createElement("div");
    checkoutList.setAttribute("class","checkout-list");

   if(cart.length > 0){

    cart.forEach(product => {

      const checkoutListItem = document.createElement("div");
      checkoutListItem.setAttribute("class","checkout-list-item");

      checkoutListItem.innerHTML = `<p class="checkout-list-item-title">${count}. ${product.title}</p>
      <p class="checkout-list-item-price">₹${product.price}</p>`;

      totalPriceValue += product.price;

      count++;

      checkoutList.append(checkoutListItem);

    })


    const total = document.createElement("div");
    total.setAttribute("class","total");

    total.innerHTML = `  <h3>Total :</h3>
    <h3 class="total-price">₹${totalPriceValue}/-</h3>`;

    const button = document.createElement("button");
    button.setAttribute("class","buy-btn");
    button.setAttribute("id","rzp-button");
    button.innerHTML = "Click To Checkout";


    cartContainerRight.append(checkoutList);
    cartContainerRight.append(total);
    cartContainerRight.append(button);

    totalAmount = totalPriceValue;

    
   }else{

    cartContainerRight.innerHTML = "Cart is Empty!!"

   }
}

function removeFromCart(id){


  let cart = getCartItems();

  cart = cart.filter(product => product.id !== id)

  localStorage.setItem("cart",JSON.stringify(cart));



  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const usersData = getUsersDataState();

  if(currentUser){

    usersData.forEach(user => {
        if(currentUser.accessToken === user.accessToken){
            user.cart = cart;
        }
    })

    localStorage.setItem("usersData",JSON.stringify(usersData));

  }

  displayDataOnCart();

  displayCheckoutList();

}


function payment(){
          // razor pay--

var options = {
  key: 'rzp_test_DdbS1vSVWO7BAb',
  amount: totalAmount*100, // The amount is in paise, so this represents ₹500.00
  currency: 'INR',
  name: 'MeShop',
  description: 'Product or Service Description',
  image: 'URL to your logo',
  handler: function(response) {
    // Handle the success response after payment
    console.log(response);

    alert(" items were purchased !!")
  }
};

var rzp = new Razorpay(options);

const button = document.getElementById("rzp-button");

console.log(button)

button.addEventListener("click" , () => {
  rzp.open();

  localStorage.setItem("cart",JSON.stringify([]));
})

}


  

window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // if current user is there that means already logged in
    
    // changing page name on load
    currentPage.innerText = `/ My Cart`;

    displayDataOnCart();

    displayCheckoutList();

    if(currentUser){

        const usersData = getUsersDataState();

        const user = usersData.filter(user => user.email === currentUser.email)[0]

        //console.log(user)

        const firstname = user.firstName;
        const lastname = user.lastName;

        // changing profile to name 
        const profile = document.getElementById("profile");

        profile.innerText = `${firstname} ${lastname}`;

        document.getElementById("login").style.display = "none";
        document.getElementById("signup").style.display = "none";

        payment();
        
        
    }else{
        document.getElementById("logout").style.display = "none";
        document.getElementById("profile").style.display = "none";
        document.getElementById("login").style.display = "inline";
        document.getElementById("signup").style.display = "inline";

        const button = document.getElementById("rzp-button");

        button.addEventListener("click" , () => {
          alert("Please Signup or Login first !!")

          document.getElementById("login").click();
        })
        
    }
};




