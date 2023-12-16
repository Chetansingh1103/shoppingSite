const loginButton = document.getElementById("login-button");
const currentPage = document.getElementById("current-page");


// get userdata from LS
function getUsersDataState(){
    return JSON.parse(localStorage.getItem("usersData")) || null;
}

// get userEmails from LS
function getUserEmailsState(){
    return JSON.parse(localStorage.getItem("userEmails")) || null;
}

// when login button is clicked
loginButton.addEventListener("click", () => {
    const usersData = getUsersDataState();
    const userEmails = getUserEmailsState();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const errorElement = document.getElementById("signup-error"); 
    const successElement = document.getElementById("signup-success");

    if(email && password){

        if(userEmails.includes(email)){

            const user = usersData.filter(user => user.email === email)[0]

            console.log(user)

            if(user.password === password){

                const accessToken = user.accessToken;

                const currentUser = {email,accessToken};

                localStorage.setItem("currentUser",JSON.stringify(currentUser));

                errorElement.textContent = "";
                successElement.textContent = "Login Successful !";

                setTimeout(() => {
                    // redirecting to the shoping page
                    let linkItem = document.createElement("a");
                    linkItem.href ="http://127.0.0.1:5500/JavascriptAdvance/projects/shopping-cart/shop/shop.html";
                    linkItem.click();
                },1000);

            }else{
                errorElement.textContent = "Incorrect Password!";
                successElement.textContent = "";
            }

        }else{
            errorElement.textContent = "Email Not Registered! Please check your email";
            successElement.textContent = "";
        }

    }else{
        errorElement.textContent = "ERROR: ALL fields are mandatory.";
        successElement.textContent = "";
    }
    

})


function setCurrentPage(name){
    localStorage.setItem("currentPage",JSON.stringify(name))
  }
  
  function getCurrentPage(){
    return JSON.parse(localStorage.getItem("currentPage"));
  }
  

  window.onload = function() {

    // changing page name on load
    currentPage.innerText = `/ Login`;

  }

