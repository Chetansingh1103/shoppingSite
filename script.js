const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button"); 
const headerHeading = document.getElementById("header-heading");
const currentPage = document.getElementById("current-page");
const profile = document.getElementById("profile")

headerHeading.addEventListener("click", () => {
  let linkItem = document.createElement("a");
  linkItem.href =
    "http://127.0.0.1:5500/JavascriptAdvance/projects/shopping-cart/index.html";
  linkItem.click();
})

loginButton.addEventListener("click", () => {
  let linkItem = document.createElement("a");
  linkItem.href =
    "http://127.0.0.1:5500/JavascriptAdvance/projects/shopping-cart/login/login.html";
  linkItem.click();

})

signupButton.addEventListener("click", () => {
    let linkItem = document.createElement("a");
    linkItem.href =
      "http://127.0.0.1:5500/JavascriptAdvance/projects/shopping-cart/signup/signup.html";
    linkItem.click();

})


// get userdata from LS
function getUsersDataState(){
  return JSON.parse(localStorage.getItem("usersData")) || null;
}

// get userEmails from LS
function getUserEmailsState(){
  return JSON.parse(localStorage.getItem("userEmails")) || null;
}


function updateCartHeader(){
  let cart = getCartItems();  

  const cartItems = document.getElementById("cartItems"); 

  if(cart.length > 0){
      cartItems.style.visibility = "visible";
      cartItems.innerText = `${cart.length}`;
  }else{
    cartItems.style.visibility = "hidden";
  }
}

// function to get cart items
function getCartItems(){
  return JSON.parse(localStorage.getItem("cart")) || [];
}


window.onload = function() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // changing page name on load
  currentPage.innerText = "/ " + "Home";

  updateCartHeader();

  // if current user is there means that already a account is logged in
  if(currentUser){

    // hidding login and signup button
    loginButton.style.display = "none";
    signupButton.style.display = "none";

    const usersData = getUsersDataState();

    const user = usersData.filter(user => user.email === currentUser.email)[0]

    //console.log(user)

    const firstname = user.firstName;
    const lastname = user.lastName;

    const containerLeft = document.getElementById("container-left");

    const p = document.createElement("p");
    const div = document.createElement("div");

    p.setAttribute("class","logged-in")

    p.innerHTML = `Hello <b>${firstname} ${lastname}....</b> Enjoy Shopping!`;

    div.innerText = "Click to Continue Shopping...."

    div.setAttribute("class","continue-shopping-btn");

    div.addEventListener("click", () => {

      let linkItem = document.createElement("a");
      linkItem.href =
        "http://127.0.0.1:5500/JavascriptAdvance/projects/shopping-cart/shop/shop.html";
      linkItem.click();    

    })

    containerLeft.append(p);

    containerLeft.append(div);


    // adding shop link to header
    const headerRight = document.getElementsByClassName("header-right")[0];

    // const a = document.createElement("a");

    // a.innerText = "Shop Now"

    // a.setAttribute("href","http://127.0.0.1:5500/JavascriptAdvance/projects/shopping-cart/shop/shop.html");

    // headerRight.append(a);

    // changing profile to name 

    profile.innerText = `${firstname} ${lastname}`;

  }else{
    const profile = document.getElementById("profile");

    profile.style.display = "none";
  }
};




