const signupButton = document.getElementById("signup-button");
const headerHeading = document.getElementById("header-heading");
const currentPage = document.getElementById("current-page");

headerHeading.addEventListener("click", () => {
    let linkItem = document.createElement("a");
    linkItem.href =
      "http://127.0.0.1:5500/JavascriptAdvance/projects/shopping-cart/index.html";
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

// saveUserState()

function saveUserState(user){
    const accessToken = generateAccessToken();
    let usersData = getUsersDataState();
    let userEmails = getUserEmailsState();

    if(usersData === null){
        usersData = [];
        userEmails = [];
    }

    user.accessToken = accessToken;
    usersData.push(user);
    localStorage.setItem("usersData",JSON.stringify(usersData));
    userEmails.push(user.email);
    localStorage.setItem("userEmails",JSON.stringify(userEmails));
}

function generateAccessToken(){
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const tokenLength = 16;
    let accessToken = "";

    for(let i = 0; i < tokenLength; i++){
        accessToken+=characters.charAt(Math.floor(Math.random()*characters.length)) 
    }

    return accessToken;
}


signupButton.addEventListener("click", () => {
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const errorElement = document.getElementById("signup-error"); 
    const successElement = document.getElementById("signup-success");
    const cart = [];

    if(firstName && lastName && email && password && confirmPassword){
        let userEmails = getUserEmailsState();

        if(userEmails === null){
            userEmails = [];
        }

        if(userEmails.includes(email)){ // checking if email already exists in LocalStorage (LS)

            errorElement.textContent = "Email Already Registered! Please Use Different Email To Create New Account";
            successElement.textContent = "";

        }else{

            if(password === confirmPassword){ // checking if password entered matches confirmed password entered then proceed further

                const user = {firstName,lastName,email,password,cart};
    
                saveUserState(user);
                errorElement.textContent = "";
                successElement.textContent = "Successfully Signed Up!";
    
                // redirecting to the login page
                let linkItem = document.createElement("a");
                linkItem.href =
                  "http://127.0.0.1:5500/JavascriptAdvance/projects/shopping-cart/login/login.html";
                linkItem.click();
    
            }else{
                errorElement.textContent = "Password mismatch";
                successElement.textContent = "";
            }

        }
        
    }else{
        errorElement.textContent = "ERROR: ALL fields are mandatory.";
        successElement.textContent = "";
    }
})

window.onload = function() {
  // changing page name on load
  currentPage.innerText = "/ " + "SignUp";
}


