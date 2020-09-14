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
import domUpdates from './domUpdates';

// ************ QUERY SELECTORS ***************
let allRecipesBtn = document.querySelector(".show-all-btn");
let filterBtn = document.querySelector(".filter-btn");
let main = document.querySelector("main");
let pantryBtn = document.querySelector(".my-pantry-btn");
let savedRecipesBtn = document.querySelector(".saved-recipes-btn");
let searchBtn = document.querySelector(".search-btn");
let searchForm = document.querySelector("#search");
let searchInput = document.querySelector("#search-input");
let showPantryRecipes = document.querySelector(".show-pantry-recipes-btn");
let modifyPantryBtn = document.querySelector(".modify-pantry-btn")
let searchIngBtn = document.querySelector(".search-ingredients-btn")

// ************ GLOBAL VARIABLES ***************

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
allRecipesBtn.addEventListener("click", showRecipes);
filterBtn.addEventListener("click", findCheckedBoxes);
main.addEventListener("click", addToMyRecipes);
pantryBtn.addEventListener("click", domUpdates.toggleMenu);
savedRecipesBtn.addEventListener("click", getSavedRecipes);
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
  allUsersData = allData[0];
  ingredientsData = allData[1];
  recipeData = allData[2];
  currentUser = new User(allUsersData[Math.floor(Math.random() * allUsersData.length)]);
  domUpdates.generateUser(currentUser);
  findPantryInfo(ingredientsData);
  findTags(recipeData);
  createCards(recipeData);
}

// CREATE RECIPE CARDS
function createCards(recipeData) {
  recipeData.forEach(recipe => {
    let recipeInfo = new Recipe(recipe);
    let shortRecipeName = recipeInfo.name;
    recipes.push(recipeInfo);
    if (recipeInfo.name.length > 40) {
      shortRecipeName = recipeInfo.name.substring(0, 40) + "...";
    }
    domUpdates.displayCard(recipeInfo, shortRecipeName)
  });
};

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
  domUpdates.listTags(tags);
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
  domUpdates.showAllRecipes(recipeData);
  if (filteredResults.length > 0) {
    filterRecipes(filteredResults);
  }
}

function filterRecipes(filtered) {
  let foundRecipes = recipes.filter(recipe => {
    return !filtered.includes(recipe);
  });
  domUpdates.hideUnselectedRecipes(foundRecipes)
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
    domUpdates.exitRecipe();
  } else if (isDescendant(event.target.closest(".recipe-card"), event.target)) {
    domUpdates.openRecipeInfo(event, recipeData, ingredientsData);
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

function getSavedRecipes() {
  domUpdates.showSavedRecipes(recipeData, currentUser);
}

function showRecipes() {
  domUpdates.showAllRecipes(recipeData);
}

// SEARCH RECIPES
function pressEnterSearch(event) {
  event.preventDefault();
  searchRecipes();
}

function searchRecipes() {
  domUpdates.showAllRecipes(recipeData);
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
  domUpdates.hideUnselectedRecipes(found);
}

function createRecipeObject(recipes) {
  recipes = recipes.map(recipe => new Recipe(recipe));
  return recipes
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
  domUpdates.showAllRecipes(recipeData);
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
