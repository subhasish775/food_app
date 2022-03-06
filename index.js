// all the 'id' tracker here 
// start point---->

const meals = document.getElementById("meals");
const favouriteContainer = document.getElementById("fav-meal");
const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");
const mealPop = document.getElementById("meal-popup");
const closeBtn = document.getElementById("close-popup");
const mealInfoEl = document.getElementById("meal-info");

// end point--->

getRandomMeal();
fetchFavMeal();
//  api data fetching area here (starting point)------> 
async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const responseData = await resp.json();
  const randomMeal = responseData.meals[0];
  addMeal(randomMeal, true);
}

async function getMealById(id) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const responData = await resp.json();
  const meal = responData.meals[0];
  return meal;
}
async function getMealByName(term) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  const responData = await resp.json();
  const meal = responData.meals;
  console.log(meal);
  return meal;
}
// <-------end of the api data fetching area 



// meal contains area (starting point)---->


function addMeal(getMeal, random = false) {
  const meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = `
           
  <div class="meal-header">
  ${random ? `<span class="random">Random Recipe</span>` : ""}
  <img
  src="${getMeal.strMealThumb}"
  alt="${getMeal.strMeal}"
  />
  </div>
  <div class="meal-body">
  <h4>${getMeal.strMeal}</h4>
  
  <button class="fav-btn "><span>Add to Favourite</span>
  
  
  <i class="fa fa-heart"></i>
  </button>
  
  </div>
  `;
  const btn = meal.querySelector(".meal-body .fav-btn");
  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      removeFromLS(getMeal.idMeal);
      btn.classList.remove("active");
    } else {
      addToLS(getMeal.idMeal);
      btn.classList.add("active");
    }
    fetchFavMeal();
  });
  // for adding the recipe of the food by clicking of the food
  meal.addEventListener('click',()=>{
    showMealInfo(getMeal);
  });
  meals.appendChild(meal);
}

// <--------end of the meal contains area 

// localstorage area starting point------>
function addToLS(mealId) {
  const mealIds = getFromLS();
  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}
function removeFromLS(mealId) {
  const mealIds = getFromLS();
  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

function getFromLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));
  return mealIds === null ? [] : mealIds;
}
//  <----end of the localstorage area 



// fav-container area staring point----->
async function fetchFavMeal() {
  // clean the container
  favouriteContainer.innerHTML = "";
  const mealIds = getFromLS();
  
  const meals = [];
  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealById(mealId);
    addMealToFav(meal);
  }
  console.log(meals);
  
  async function addMealToFav(mealData) {
    // console.log(meal);
    const favouriteMeal = document.createElement("li");
    favouriteMeal.innerHTML = `
    
              <img
              src="${mealData.strMealThumb}"
              alt="${mealData.strMeal}"
              />
              <span>${mealData.strMeal}</span>
              <button class="clear"><i class="fa-solid fa-circle-xmark"></i></button>
              `;
              const btn = favouriteMeal.querySelector(".clear");
              btn.addEventListener("click", () => {
                removeFromLS(mealData.idMeal);
                fetchFavMeal();
              });
              favouriteMeal.addEventListener('click',()=>{
                showMealInfo(mealData);
              });
              favouriteContainer.appendChild(favouriteMeal);
            }
          }
          
         
     
  // This is made for searching objects(starting point )----->        
          searchBtn.addEventListener("click", async () => {
  // cleanup the container
  meals.innerHTML = "";
  const search = searchTerm.value;
  const searchMeal = await getMealByName(search);
  console.log(searchMeal);
  if (searchMeal === null) {
    alert("No such food found");
  } else {
    searchMeal.forEach((meal) => {
      addMeal(meal);
    });
  }
});
// <-----End of the search portion 



// code for the popup close button in meal-info section
closeBtn.addEventListener("click", () => {
  mealPop.classList.add("hidden");
});
 




// meal-info part (strtaing point)----->
function showMealInfo(mealData) {
mealInfoEl.innerHTML= "";
  const mealInfo = document.createElement("div");
  const ingredients =[];
// This is for ingredients and measure portion (starting point)
  for(let i=1 ; i<=20; i++){
    if(mealData["strIngredient" + i]){
     ingredients.push(
       `${mealData["strIngredient" + i]}/
     ${mealData["strMeasure" + i]}`
     )
     console.log(ingredients);
    }else {
      break;
    }
  }
  // end of the ingrediends and measure portion 
  mealInfo.innerHTML = `
  <h1>${mealData.strMeal}</h1>
  <img src="${mealData.strMealThumb}" alt="" />
  
  
  <p>${mealData.strInstructions}</p>
<h3>Ingredients:</h3>
  <ul>
  ${ingredients
    .map(
      (ing)=>`
      <li>${ing}</li>
  `
  )
  .join("")}
</ul>  
`;
  
  mealInfoEl.appendChild(mealInfo);
  mealPop.classList.remove('hidden');
}
// <-----End of the meal-info part 








