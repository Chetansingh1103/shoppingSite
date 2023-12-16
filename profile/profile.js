const logoutHeader = document.getElementById("logout");
const logoutButton = document.getElementById("logout-button");
const updateName = document.getElementById("update-name");
const updatePassword = document.getElementById("update-password");
const currentPage = document.getElementById("current-page");

// get userdata from LS
function getUsersDataState(){
    return JSON.parse(localStorage.getItem("usersData")) || null;
}

// get userEmails from LS
function getUserEmailsState(){
    return JSON.parse(localStorage.getItem("userEmails")) || null;
}

// if user updates the name then we have to update usersData from LS
updateName.addEventListener("click", () => {
    const firstname =  document.getElementById("first-name").value;
    const lastname =  document.getElementById("last-name").value;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const usersData = getUsersDataState();

    usersData.forEach(user => {
        if(currentUser.accessToken === user.accessToken){
            user.firstName = firstname;
            user.lastName = lastname;
        }
    })

    localStorage.setItem("usersData",JSON.stringify(usersData));

    // sending success message after updating values to LS
    document.getElementById("success-message1").innerText = "Details Updated!";

    setTimeout(() => {
        document.getElementById("success-message1").innerText = "";
    },3000);

})


// if user updates the password then we have to update usersData from LS
updatePassword.addEventListener("click", () => {
    const newPassword=  document.getElementById("new-password").value;
    const confirmNewPassword =  document.getElementById("confirm-new-password").value;
    const successMessage =  document.getElementById("success-message2");
    const errorMessage =  document.getElementById("error-message2");

    if(newPassword && confirmNewPassword){
        if(newPassword === confirmNewPassword){

            const currentUser = JSON.parse(localStorage.getItem("currentUser"));

            const usersData = getUsersDataState();
        
            usersData.forEach(user => {
                if(currentUser.accessToken === user.accessToken){
                    user.password = newPassword;
                }
            })
        
            localStorage.setItem("usersData",JSON.stringify(usersData));
        
            // sending success message after updating values to LS
           successMessage.innerText = "Password Updated!";
           errorMessage.innerText = "";
        
            setTimeout(() => {
                document.getElementById("success-message2").innerText = "";
            },3000);

            setTimeout(() => {
               location.reload();
            },4000);

        }else{
            errorMessage.textContent = "Password and Confirm Password does not match!";
            successMessage.textContent = "";
        }
    }else{
        errorMessage.textContent = "Please fill all details!";
        successMessage.textContent = "";
    }

})


// if we click on these link logout then page is refreshed and redirects to home page
logoutHeader.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    location.reload();
    let linkItem = document.createElement("a");
    linkItem.href =
      "/index.html";
    linkItem.click();
})

// if we click on these button logout then page is refreshed and redirects to home page
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    location.reload();
    let linkItem = document.createElement("a");
    linkItem.href =
      "/index.html";
    linkItem.click();
})


function setCurrentPage(name){
    localStorage.setItem("currentPage",JSON.stringify(name))
  }
  
  function getCurrentPage(){
    return JSON.parse(localStorage.getItem("currentPage"));
  }
  


window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // if current user is there that means already logged in


    if(currentUser){

        const usersData = getUsersDataState();

        const user = usersData.filter(user => user.email === currentUser.email)[0]

        //console.log(user)

        // displaying details on profile 
        const firstname = user.firstName;
        const lastname = user.lastName;
        const oldPassword = user.password;

        document.getElementById("first-name").value = `${firstname}`;
        document.getElementById("last-name").value = `${lastname}`;
        document.getElementById("old-password").value = `${oldPassword}`;

        // changing page name on load
        currentPage.innerText = `/ ${firstname} ${lastname}`;
    }
};

