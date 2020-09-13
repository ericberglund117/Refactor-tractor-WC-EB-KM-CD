// ************ IMPORTED FILES ***************
import $ from 'jquery';
import './css/base.scss';
import './css/styles.scss';
import './images/seasoning.png';
import './images/apple-logo.png';
import './images/apple-logo-outline.png';
import './images/search.png';
import './images/cookbook.png';
import User from './user';
import Recipe from './recipe';

// ************ QUERY SELECTORS ***************
let allRecipesBtn = document.querySelector(".show-all-btn");
let filterBtn = document.querySelector(".filter-btn");
let fullRecipeInfo = document.querySelector(".recipe-instructions");
let main = document.querySelector("main");
let pantryBtn = document.querySelector(".my-pantry-btn");
let savedRecipesBtn = document.querySelector(".saved-recipes-btn");
let searchBtn = document.querySelector(".search-btn");
let searchForm = document.querySelector("#search");
let searchInput = document.querySelector("#search-input");
let showPantryRecipes = document.querySelector(".show-pantry-recipes-btn");
let tagList = document.querySelector(".tag-list");
let modifyPantryBtn = document.querySelector(".modify-pantry-btn")
let searchIngBtn = document.querySelector(".search-ingredients-btn")

// ************ GLOBAL VARIABLES ***************
let menuOpen = false;
let pantryInfo = [];
let recipes = [];
let allUsersData;
let currentUser;
let ingredientsData;
let recipeData;

window.addEventListener("load", checkData);
document.addEventListener('click', (e) => modifyIngredientCount(e));
document.addEventListener('click', (e) => submitPantryChanges(e));
// window.addEventListener("load", createCards);
// window.addEventListener("load", findTags);
// window.addEventListener("load", getUsers);
//window.addEventListener("load", generateUser);
// window.addEventListener("load", getIngredients);
// window.addEventListener("load", getRecipes);
allRecipesBtn.addEventListener("click", showAllRecipes);
filterBtn.addEventListener("click", findCheckedBoxes);
main.addEventListener("click", addToMyRecipes);
pantryBtn.addEventListener("click", toggleMenu);
savedRecipesBtn.addEventListener("click", showSavedRecipes);
searchBtn.addEventListener("click", searchRecipes);
showPantryRecipes.addEventListener("click", findCheckedPantryBoxes);
searchForm.addEventListener("submit", pressEnterSearch);
modifyPantryBtn.addEventListener("click", displayModifyPantryForm);
searchIngBtn.addEventListener("click", createPostForm);


//-----fetch request---------
function checkData() {
  Promise.all([getUsers(), getIngredients(), getRecipes()])
  .then(data => loadPageInfo(data))
  .catch(error => console.log(error))
}

function getUsers() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData')
    .then(response => response.json())
    .then(data => data.wcUsersData)
    .catch(error => console.log(error))
}

function getIngredients() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData')
    .then(response => response.json())
    .then(data => data.ingredientsData)
    .catch(error => console.log(error))
}

function getRecipes() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData')
    .then(response => response.json())
    .then(data => data.recipeData)
    .catch(error => console.log(error))
}

function loadPageInfo(allData) {
  allUsersData = allData[0]
  ingredientsData = allData[1]
  recipeData = allData[2]
  generateUser(allUsersData)
  findPantryInfo(ingredientsData)
  findTags(recipeData)
  createCards(recipeData)
}

// GENERATE A USER ON LOAD
function generateUser(allUsersData) {
  currentUser = new User(allUsersData[Math.floor(Math.random() * allUsersData.length)]);
  let firstName = currentUser.name.split(" ")[0];
  let welcomeMsg = `
    <div class="welcome-msg">
      <h1>Welcome ${firstName}!</h1>
    </div>`;
  document.querySelector(".banner-image").insertAdjacentHTML("afterbegin",
    welcomeMsg);
}

// CREATE RECIPE CARDS
function createCards(recipeData) {
  // console.log(recipeData)
  recipeData.forEach(recipe => {
    let recipeInfo = new Recipe(recipe);
    let shortRecipeName = recipeInfo.name;
    recipes.push(recipeInfo);
    if (recipeInfo.name.length > 40) {
      shortRecipeName = recipeInfo.name.substring(0, 40) + "...";
    }
    addToDom(recipeInfo, shortRecipeName)
  });
};

function addToDom(recipeInfo, shortRecipeName) {
  let cardHtml = `
    <div class="recipe-card" id=${recipeInfo.id}>
      <h3 maxlength="40">${shortRecipeName}</h3>
      <div class="card-photo-container">
        <img src=${recipeInfo.image} class="card-photo-preview" alt="${recipeInfo.name} recipe" title="${recipeInfo.name} recipe">
        <div class="text">
          <div>Click for Instructions</div>
        </div>
      </div>
      <h4>${recipeInfo.tags[0]}</h4>
      <img src="./images/apple-logo-outline.png" alt="unfilled apple icon" class="card-apple-icon">
    </div>`
  main.insertAdjacentHTML("beforeend", cardHtml);
}

// FILTER BY RECIPE TAGS
function findTags(recipeData) {
  let tags = [];
  recipeData.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });
  tags.sort();
  listTags(tags);
}

function listTags(allTags) {
  allTags.forEach(tag => {
    let tagHtml = `<li><input type="checkbox" class="checked-tag" id="${tag}">
      <label for="${tag}">${capitalize(tag)}</label></li>`;
    tagList.insertAdjacentHTML("beforeend", tagHtml);
  });
}

function capitalize(words) {
  console.log(typeof words);
  return words.split(" ").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

function findCheckedBoxes() {
  let tagCheckboxes = document.querySelectorAll(".checked-tag");
  let checkboxInfo = Array.from(tagCheckboxes)
  let selectedTags = checkboxInfo.filter(box => {
    return box.checked;
  })
  findTaggedRecipes(selectedTags);
}

function findTaggedRecipes(selected) {
  let filteredResults = [];
  selected.forEach(tag => {
    let allRecipes = recipes.filter(recipe => {
      return recipe.tags.includes(tag.id);
    });
    allRecipes.forEach(recipe => {
      if (!filteredResults.includes(recipe)) {
        filteredResults.push(recipe);
      }
    })
  });
  showAllRecipes();
  if (filteredResults.length > 0) {
    filterRecipes(filteredResults);
  }
}

function filterRecipes(filtered) {
  let foundRecipes = recipes.filter(recipe => {
    return !filtered.includes(recipe);
  });
  hideUnselectedRecipes(foundRecipes)
}

function hideUnselectedRecipes(foundRecipes) {
  foundRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
}

// FAVORITE RECIPE FUNCTIONALITY
function addToMyRecipes(event) {
  if (event.target.className === "card-apple-icon") {
    let cardId = parseInt(event.target.closest(".recipe-card").id)
    if (!currentUser.favoriteRecipes.includes(cardId)) {
      event.target.src = "./images/apple-logo.png";
      currentUser.saveRecipe(cardId);
    } else {
      event.target.src = "./images/apple-logo-outline.png";
      currentUser.removeRecipe(cardId);
    }
  } else if (event.target.id === "exit-recipe-btn") {
    exitRecipe();
  } else if (isDescendant(event.target.closest(".recipe-card"), event.target)) {
    openRecipeInfo(event);
  }
}

function isDescendant(parent, child) {
  let node = child;
  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function showSavedRecipes() {
  let unsavedRecipes = recipes.filter(recipe => {
    return !currentUser.favoriteRecipes.includes(recipe.id);
  });
  unsavedRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
  showMyRecipesBanner();
}

// CREATE RECIPE INSTRUCTIONS
function openRecipeInfo(event) {
  fullRecipeInfo.style.display = "inline";
  let recipeId = event.composedPath().find(e => e.id).id;
  let recipe = recipeData.find(recipe => recipe.id === Number(recipeId));
  // console.log("Captain Crusty", recipe);
  // console.log("Uncle Billy", recipeData);
  generateRecipeTitle(recipe, generateIngredients(recipe));
  addRecipeImage(recipe);
  generateInstructions(recipe);
  fullRecipeInfo.insertAdjacentHTML("beforebegin", "<section id='overlay'></div>");
}

function generateRecipeTitle(recipe, ingredients) {
  let recipeTitle = `
    <button id="exit-recipe-btn">X</button>
    <h3 id="recipe-title">${recipe.name}</h3>
    <h4>Ingredients</h4>
    <p>${ingredients}</p>`
  fullRecipeInfo.insertAdjacentHTML("beforeend", recipeTitle);
}

function addRecipeImage(recipe) {
  document.getElementById("recipe-title").style.backgroundImage = `url(${recipe.image})`;
}

function generateIngredients(recipe) {
  console.log(ingredientsData);
  return recipe && recipe.ingredients.map(ingredient => {
    let ingredientInfo = ingredientsData.find(dataIng => dataIng.id === ingredient.id);
    return `${capitalize(ingredientInfo.name)} (${ingredient.quantity.amount} ${ingredient.quantity.unit})`
  }).join(", ");
}

function generateInstructions(recipe) {
  let instructionsList = "";
  let instructions = recipe.instructions.map(i => {
    return i.instruction
  });
  instructions.forEach(i => {
    instructionsList += `<li>${i}</li>`
  });
  fullRecipeInfo.insertAdjacentHTML("beforeend", "<h4>Instructions</h4>");
  fullRecipeInfo.insertAdjacentHTML("beforeend", `<ol>${instructionsList}</ol>`);
}

function exitRecipe() {
  while (fullRecipeInfo.firstChild &&
    fullRecipeInfo.removeChild(fullRecipeInfo.firstChild));
  fullRecipeInfo.style.display = "none";
  document.getElementById("overlay").remove();
}

// TOGGLE DISPLAYS
function showMyRecipesBanner() {
  document.querySelector(".welcome-msg").style.display = "none";
  document.querySelector(".my-recipes-banner").style.display = "block";
}

function showWelcomeBanner() {
  document.querySelector(".welcome-msg").style.display = "flex";
  document.querySelector(".my-recipes-banner").style.display = "none";
}

// SEARCH RECIPES
function pressEnterSearch(event) {
  event.preventDefault();
  searchRecipes();
}

function searchRecipes() {
  showAllRecipes();
  let searchedRecipes = recipeData.filter(recipe => {
    return recipe.name.toLowerCase().includes(searchInput.value.toLowerCase());
  });
  filterNonSearched(createRecipeObject(searchedRecipes));
}

function filterNonSearched(filtered) {
  let found = recipes.filter(recipe => {
    let ids = filtered.map(f => f.id);
    return !ids.includes(recipe.id)
  })
  hideUnselectedRecipes(found);
}

function createRecipeObject(recipes) {
  recipes = recipes.map(recipe => new Recipe(recipe));
  return recipes
}

function toggleMenu() {
  var menuDropdown = document.querySelector(".drop-menu");
  menuOpen = !menuOpen;
  if (menuOpen) {
    menuDropdown.style.display = "block";
  } else {
    menuDropdown.style.display = "none";
  }
}

function showAllRecipes() {
  recipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "block";
  });
  showWelcomeBanner();
}

// CREATE AND USE PANTRY
function findPantryInfo(ingredientsData) {
  // console.log(user.pantry)
  // console.log(pantryInfo)
  let pantryMatch = currentUser.pantry.map(item => {
    let itemInfo = ingredientsData.find(ingredient => {
      return ingredient.id === item.ingredient;
    });
    let originalIngredient = pantryInfo.find(ingredient => {
      if (itemInfo) {
        return ingredient.name === itemInfo.name;
      }
    });
    if (itemInfo && originalIngredient) {
      originalIngredient.count += item.amount;
    } else if (itemInfo) {
      pantryInfo.push({name: itemInfo.name, count: item.amount});
    }
  });
  displayPantryInfo(pantryInfo.sort((a, b) => a.name.localeCompare(b.name)));
}

function displayPantryInfo(pantry) {
  pantry.forEach(ingredient => {
    let ingredientHtml = `<li><input type="checkbox" class="pantry-checkbox" id="${ingredient.name}">
      <label for="${ingredient.name}">${ingredient.name}, ${ingredient.count}</label></li>`;
    document.querySelector(".pantry-list").insertAdjacentHTML("beforeend",
      ingredientHtml);
  });
}

function findCheckedPantryBoxes() {
  let pantryCheckboxes = document.querySelectorAll(".pantry-checkbox");
  let pantryCheckboxInfo = Array.from(pantryCheckboxes)
  let selectedIngredients = pantryCheckboxInfo.filter(box => {
    return box.checked;
  })
  showAllRecipes();
  if (selectedIngredients.length > 0) {
    findRecipesWithCheckedIngredients(selectedIngredients);
  }
}

function findRecipesWithCheckedIngredients(selected) {
  let recipeChecker = (arr, target) => target.every(v => arr.includes(v));
  let ingredientNames = selected.map(item => {
    return item.id;
  })
  recipes.forEach(recipe => {
    let allRecipeIngredients = [];
    recipe.ingredients.forEach(ingredient => {
      allRecipeIngredients.push(ingredient.name);
    });
    if (!recipeChecker(allRecipeIngredients, ingredientNames)) {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    }
  })
}

function displayModifyPantryForm() {
  document.getElementById('post-to-pantry').style.display = 'flex';
}

function showPostForm() {
  document.getElementById('searched-ingredient-results').innerHTML = '';
  document.getElementById('search-ingredients-input').value = '';
  document.getElementById('post-to-pantry').style.display = 'flex';
}

function searchPantry() {
  const searchIngredientsInput = document.getElementById('search-ingredients-input');
  const search = searchIngredientsInput.value.toLowerCase();
  return ingredientsData.filter(ingred => ingred.name).filter(ingred => ingred.name.includes(search));
}

function createPostForm(event) {
  if (event.target && event.target.classList.contains('search-ingredients-btn')) {
    let ingredients = searchPantry();
    displaySearchedIngreds(ingredients);
  }
}

function displaySearchedIngreds(ingreds) {
    let results = document.getElementById('searched-ingredient-results');
    results.innerHTML = '';
    ingreds.forEach(ingred => {
      results.insertAdjacentHTML('afterbegin', `
				<div class="searched-ingredient" id="${ingred.id}">
					<div id="add-subtract">
						<button id="minus">-</button>
						<input class="amount" placeholder="value..." value=0>
						<button id="plus">+</button>
					</div>
					<p id="ingred-name">${ingred.name}</p>
				</div>
			`);
    })
  };

  function modifyIngredientCount(event) {
    if (event.target && event.target.id === 'minus') {
      subtractIngredientCount(event);
    }
    if (event.target && event.target.id === 'plus') {
      addIngredientCount(event);
    }
  }

  function subtractIngredientCount(event) {
    let amount = event.target.nextSibling.nextSibling;
    amount.value--;
  };

  function addIngredientCount(event) {
    let amount = event.target.previousSibling.previousSibling	;
    amount.value++;
    console.log(amount)
  };

  function submitPantryChanges(event) {
  if (event.target && event.target.id === 'save-changes-btn') {
    let amounts = Array.from(document.querySelectorAll('.amount'));
    amounts.forEach(amount => {
      if (amount.value && amount.value !== 0) {
        let ingredID = amount.parentNode.parentNode.id;
        let ingredMod = amount.value;
        console.log('id', ingredID, 'value', ingredMod)
        if(ingredMod > 0 || ingredMod < 0){
          currentUser.updateCurrentUserPantry(ingredID, ingredMod);
          updatePantryIngredients(ingredID, ingredMod)
        }
      }
    })
  }
}


function updatePantryIngredients(ingredID, ingredMod) {
  fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "userID": currentUser.id,
      "ingredientID": +ingredID,
      "ingredientModification": +ingredMod
    })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.log(error))
}

//
// function stockPantryIngredients
