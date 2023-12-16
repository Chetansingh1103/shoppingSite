const logoutButton = document.getElementById("logout");
const currentPage = document.getElementById("current-page");
const searchContainer = document.getElementsByClassName("search-container")[0];
const allProductCategories = document.getElementsByClassName("all-products")[0];
let allProductStorageArray = []; // this will be the array which stores the value of product from the fetched api and some values has been updated which is better for displaying data on webpage like color and size
const suggestionsContainer = document.getElementsByClassName("suggestions-container")[0];
let selectedColor = "";
let selectedSize = "";
let selectedRating = "";
let selectedPriceRange = "";



function loadAllData(){

// fetching categories to build array of categories
fetch('https://fakestoreapi.com/products/categories').then(res=>res.json()).then(json=>filterAndDisplayCategoriesData(json))
}


function filterAndDisplayCategoriesData(data){

    data.forEach((categoryName) => {
        
        let updatedCategory = changeFirstLetterToUpperCase(categoryName); // making first letter capital to display it on web page
        // console.log(updatedCategory)
        const categoryContainer = document.createElement("div");
        categoryContainer.setAttribute("class","category");
        const categoryHeading = document.createElement("h2");
        categoryHeading.innerText = `${updatedCategory}`;
        const categoryItems = document.createElement("div");
        categoryItems.setAttribute("class","category-items");
        categoryContainer.append(categoryHeading);
        

        

        fetch(`https://fakestoreapi.com/products/category/${categoryName}`).then(res=>res.json()).then(json=> {

            //let jsonClone = json.filter(item => item.category === category); // filtered products of same category into jsonClone 

            let colors = ["red","blue","green","black","white"];


            //let size = ["S","M","L","XL"];

            
            
            json.forEach((product) => {
               
                let obj = { 
                    id: product.id, 
                    title: product.title, 
                    price: Math.ceil(product.price*83.40), 
                    description: product.description,		
                    category: updatedCategory,
                    image: product.image, 
                    rating: {rate: product.rating.rate, count: product.rating.count} ,
                    colours: colors[getRandomColor(colors)],
                    sizes: ["S","M","L","XL"],
                };
                

                const div = document.createElement("div");
                div.setAttribute("class","item-colors");
        
                
                const span = document.createElement("span");
                span.setAttribute("class",`${obj.colours}`);
                div.append(span);
                

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
                item.innerHTML = ` <img src="${product.image}" alt="item image">
                <div class="title">
                    <p>${product.title}</p>
                </div>
                <div class="item-price-and-size">
                    <p class="item-price">₹${Math.ceil(product.price*83.40)}</p>
                    <p class="item-size">S,M,L,XL</p>
                </div>
                <div class="item-colors-container">
                    <h4>Colors :</h4>
                </div>
                <div class="item-rating">
                    <h4>Rating :</h4>
                </div>
                <button class="add-to-cart-btn" onclick = "addToCart(${product.id})">Add to cart</button>`; // created addto cart function and passed id as parameter to search for it to add it into the cart


                item.children[3].append(div);

                item.children[4].append(itemStar);

                categoryItems.append(item);

                let check = false;

                if(allProductStorageArray.length === 0){

                    check = false;

                }else{
                    allProductStorageArray.forEach(product => {
                        if(product.id === obj.id){
                            check = true;
                        }
                    })
                }

                if(!check){
                    allProductStorageArray.push(obj);
                }

            })

            categoryContainer.append(categoryItems);
   

        }) 

        allProductCategories.append(categoryContainer);

    })
}

function openModal() {
    document.getElementById("modalOverlay").style.display = 'flex';
}

function closeModal() {
    window.document.body.removeChild(document.getElementById("modalOverlay"));
}

function getRandomColor(colors){
    return Math.floor(Math.random()*colors.length);
}

function getRandomSize(size){
    return Math.floor(Math.random()*size.length);
}

function submitSelection(id) {

    console.log(id)

    const size = document.getElementById('sizeDropdown').value;
    const color = document.getElementById('colorDropdown').value;


    const cart = getCartItems();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const usersData = getUsersDataState();


    // checking if clicked add to cart item id is matching product id in out product storage array and then pushing that product to out cart
    allProductStorageArray.forEach((product) => {

        let obj = JSON.parse(JSON.stringify(product));

        let colors = [color];

        let sizes = [size];

        obj.colours = colors;

        obj.sizes = sizes;
   
            if(id === product.id){
                cart.push(obj);
            } 

    })


    localStorage.setItem("cart",JSON.stringify(cart));

   
    if(currentUser){

        usersData.forEach(user => {
            if(currentUser.accessToken === user.accessToken){
                user.cart = cart;
            }
        })
    
        localStorage.setItem("usersData",JSON.stringify(usersData));

    }

    // updating cart header value
    updateCartHeader();

    // closing modal
    closeModal();
}

// function to add items to the cart
function addToCart(id){

    let product = {};

    allProductStorageArray.forEach(pro => {
   
            if(id === pro.id){

                product = JSON.parse(JSON.stringify(pro));
                
            } 

    })

    const select = document.createElement("select");
    select.setAttribute("id","colorDropdown");

    
    const option = document.createElement("option");
    option.setAttribute("value",`${product.colours}`);
    option.innerText = `${product.colours}`;
    select.append(option);
    

    const modal = document.createElement("div");
    modal.setAttribute("id","modalOverlay")
    modal.setAttribute("class","modalOverlay")
    modal.innerHTML = ` <div id="modalContent">
    <span id="closeButton" onclick="closeModal()">&times;</span>
    <h2>Select Size and Color</h2>
    <label for="sizeDropdown">Size:</label>
    <select id="sizeDropdown">
      <option value="S">Small</option>
      <option value="M">Medium</option>
      <option value="L">Large</option>
      <option value="XL">Extra Large</option>
    </select>

    <span>
      <label for="colorDropdown">Color:</label>
    </span> 

    <button onclick="submitSelection(${id})" class="add">Add To Cart</button>
  </div>`;


    modal.children[0].children[4].append(select)

    window.document.body.append(modal);

    // after clicking we open modal to let user select color and size
    openModal();

}

// displaying suggestions and filtering data based on clicked suggestion
function displaySuggestions(){

    fetch('https://fakestoreapi.com/products/categories').then(res=>res.json()).then(json=>

    
    json.forEach((categoryName) => {

        
        let updatedCategory = changeFirstLetterToUpperCase(categoryName);
        const clickableSuggestion = document.createElement("div");
        clickableSuggestion.setAttribute("class","clickable-suggestion");


        const heading = document.createElement("h3");
        heading.innerText = updatedCategory;

        clickableSuggestion.append(heading);

        clickableSuggestion.addEventListener("click",() => {

            // getting all the suggestions by query selector and changing their colors
            const allClickableSuggestions = document.querySelectorAll(".clickable-suggestion");

            allClickableSuggestions.forEach((Suggestion) => {
                Suggestion.style.background = "white";
                Suggestion.style.color = "black";
            })

            // changing current clicked suggestion colors to keep it focused
            clickableSuggestion.style.background = "black";
            clickableSuggestion.style.color = "white";

            // reset all products when we click on any suggestion
            allProductCategories.innerHTML = "";

            const data = [];

            data.push(categoryName);

            // calling the filter function to filter data based on selected suggestion
            filterAndDisplayCategoriesData(data);

        })

        // adding all suggestions to the suggestions-container
        suggestionsContainer.append(clickableSuggestion);
    })

    )
    

    // allCategoryStorageArray.forEach((categoryObj) => {

       

    // })

   
}


// function to change color of all option on suggestion container and laod all the details again when clicked on it
function loadAllAndChangeColor(obj){

    // getting all the suggestions by query selector and changing their colors
    const allClickableSuggestions = document.querySelectorAll(".clickable-suggestion");

    allClickableSuggestions.forEach((Suggestion) => {
        Suggestion.style.background = "white";
        Suggestion.style.color = "black";
    })

    // changing all option colors to keep it focused
    obj.style.background = 'black'; 
    obj.style.color = 'white'

    // reset all products when we click on all option
    allProductCategories.innerHTML = "";

    //now load all the default data again by calling loadAllData function
    loadAllData();
}


// function to search products based on entered input on search bar
function searchProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    if(searchInput.length === 0){

        allProductCategories.innerHTML = "";

        loadAllData();

         // getting all the suggestions by query selector and changing their colors
         const allClickableSuggestions = document.querySelectorAll(".clickable-suggestion");

         allClickableSuggestions.forEach((Suggestion) => {
             Suggestion.style.background = "white";
             Suggestion.style.color = "black";
         })
        
        suggestionsContainer.style.display = "flex";

        return;
        
    }

     // Filter data based on the search input
     const filteredData = allProductStorageArray.filter(product => product.title.toLowerCase().includes(searchInput));
 
     // Clear previous results
     allProductCategories.innerHTML = '';

     // Display search results
     if (filteredData.length > 0) {

         displayData(filteredData);
     
     } else {

       allProductCategories.textContent = 'No results found.';

     }


}


// searching and displaying products based on applied filter
function searchApplyFilterProducts(){

        let filteredData = JSON.parse(JSON.stringify(allProductStorageArray));

        if(selectedColor === "" && selectedSize === "" && selectedRating === "" && selectedPriceRange === ""){
            return;
        }else{
            if(selectedColor !== ""){
                filteredData = filteredData.filter(product => product.colours.includes(selectedColor))
                console.log(filteredData)
            }
            if(selectedSize !== ""){
                filteredData = filteredData.filter(product => product.sizes.includes(selectedSize))
            }
            if(selectedRating !== ""){
                filteredData = filteredData.filter(product => product.rating.rate >= selectedRating)
            }
            if(selectedPriceRange !== ""){
                
                filteredData = filteredData.filter(product => product.price >= selectedPriceRange.split("-")[0])
                filteredData = filteredData.filter(product => product.price <= selectedPriceRange.split("-")[1])

            }
        }


        // Clear previous results
        allProductCategories.innerHTML = '';

        // Display search results
        if (filteredData.length > 0) {

            displayData(filteredData);
        
        } else {
          allProductCategories.textContent = 'No results found.';
        }
   

}


// function to display filtered data
function displayData(filteredData){

    const resultContainer = document.createElement("div");
    resultContainer.setAttribute("class","result-container");

    suggestionsContainer.style.display = "none";


    filteredData.forEach(product => {


        const div = document.createElement("div");
        div.setAttribute("class","item-colors");

        
        const span = document.createElement("span");
        span.setAttribute("class",`${product.colours}`);
        div.append(span);
        


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
        item.innerHTML = ` <img src="${product.image}" alt="item image">
        <div class="title">
            <p>${product.title}</p>
        </div>
        <div class="item-price-and-size">
            <p class="item-price">₹${product.price}</p>
            <p class="item-size">S,M,L,XL</p>
        </div>
        <div class="item-colors-container">
            <h4>Colors :</h4> 
        </div>
        <div class="item-rating">
            <h4>Rating :</h4>
        </div>
        <button class="add-to-cart-btn" onclick = "addToCart(${product.id})">Add to cart</button>`;

       item.children[3].append(div);

       item.children[4].append(itemStar);

       resultContainer.append(item);

    })

    allProductCategories.append(resultContainer);


}  



function getColor(color){
    selectedColor = color;
}

function getSize(size){
    selectedSize = size;
}

function getRating(rating){
    selectedRating = rating;
}

function getPriceRange(priceRange){
    selectedPriceRange = priceRange;
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

// function to change first letter of a given word to capital letter
function changeFirstLetterToUpperCase(name){
    return name.charAt(0).toUpperCase() + name.slice(1);
}

 // get userdata from LS
function getUsersDataState(){
    return JSON.parse(localStorage.getItem("usersData")) || null;
}

// get userEmails from LS
function getUserEmailsState(){
    return JSON.parse(localStorage.getItem("userEmails")) || null;
}

logoutButton.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("cart");
})

searchContainer.addEventListener("click",() => {
    const search = document.getElementById("searchInput");
    search.focus();
})

// when window loads
window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // if current user is there that means already logged in

    // changing page name on load
    currentPage.innerText = "/ " + "Shop Now";

    loadAllData();

    displaySuggestions();

    updateCartHeader();

    if(currentUser){

        

        const usersData = getUsersDataState();

        const user = usersData.filter(user => user.email === currentUser.email)[0];

        localStorage.setItem("cart",JSON.stringify(user.cart));

        //console.log(user)

        const firstname = user.firstName;
        const lastname = user.lastName;

        // changing profile to name 
        const profile = document.getElementById("profile");

        profile.innerText = `${firstname} ${lastname}`;

        document.getElementById("login").style.display = "none";
        document.getElementById("signup").style.display = "none";
    }else{
        logoutButton.style.display = "none";
        document.getElementById("profile").style.display = "none";
        document.getElementById("login").style.display = "inline";
        document.getElementById("signup").style.display = "inline";
    }



    
};



