// ************ IMPORTED FILES *************** //
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

// ************ QUERY SELECTORS *************** //
let allRecipesBtn = document.querySelector(".show-all-btn");
let filterBtn = document.querySelector(".filter-btn");
let main = document.querySelector("main");
let pantryBtn = document.querySelector(".my-pantry-btn");
let savedRecipesBtn = document.querySelector(".saved-recipes-btn");
let searchBtn = document.querySelector(".search-btn");
let searchForm = document.querySelector("#search");
let showPantryRecipes = document.querySelector(".show-pantry-recipes-btn");
let modifyPantryBtn = document.querySelector(".modify-pantry-btn");
let searchIngredientBtn = document.querySelector(".search-ingredients-btn");

// ************ GLOBAL VARIABLES *************** //
let recipes = [];
let currentUser;
let ingredientsData;
let recipeData;

// ************ EVENT LISTENERS *************** //
window.addEventListener("load", checkData);
document.addEventListener('click', (e) => modifyIngredientCount(e));
document.addEventListener('click', (e) => submitPantryChanges(e));
allRecipesBtn.addEventListener("click", showRecipes);
filterBtn.addEventListener("click", findCheckedBoxes);
main.addEventListener("click", addToFavorites);
pantryBtn.addEventListener("click", domUpdates.toggleMenu);
savedRecipesBtn.addEventListener("click", getSavedRecipes);
searchBtn.addEventListener("click", searchRecipes);
showPantryRecipes.addEventListener("click", determineCookableRecipes);
searchForm.addEventListener("submit", pressEnterSearch);
modifyPantryBtn.addEventListener("click", domUpdates.displayModifyPantryForm);
searchIngredientBtn.addEventListener("click", createPantryModifyForm);

// ************ FETCH REQUESTS/MAIN DATA *************** //
function checkData() {
  Promise.all([getUsers(), getIngredients(), getRecipes()])
    .then(data => loadPageInfo(data))
    .catch(error => console.log(error))
};

function getUsers() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData')
    .then(response => response.json())
    .then(data => data.wcUsersData)
    .catch(error => console.log(error))
};

function getIngredients() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData')
    .then(response => response.json())
    .then(data => data.ingredientsData)
    .catch(error => console.log(error))
};

function getRecipes() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData')
    .then(response => response.json())
    .then(data => data.recipeData)
    .catch(error => console.log(error))
};

function loadPageInfo(allData) {
  let allUsersData = allData[0];
  ingredientsData = allData[1];
  recipeData = instantiateRecipes(allData[2]);
  currentUser = new User(allUsersData[Math.floor(Math.random() * allUsersData.length)]);
  domUpdates.welcomeUser(currentUser);
  findPantryInfo(ingredientsData);
  createRecipeTypeList(recipeData);
  createRecipeCards(recipeData);
};

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
};

// ************ RECIPES *************** //
function instantiateRecipes(recipes) {
  recipes = recipes.map(recipe => new Recipe(recipe));
  return recipes
};

function createRecipeCards(recipeData) {
  recipeData.forEach(recipe => {
    let shortRecipeName = recipe.name;
    recipes.push(recipe);
    if (recipe.name.length > 40) {
      shortRecipeName = recipe.name.substring(0, 40) + "...";
    }
    domUpdates.displayRecipeCard(recipe, shortRecipeName);
  });
};

// *** Recipe Type *** //
function createRecipeTypeList(recipeData) {
  let recipeTypeList = [];
  recipeData.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!recipeTypeList.includes(tag)) {
        recipeTypeList.push(tag);
      };
    });
  });
  recipeTypeList.sort();
  domUpdates.displayRecipeTags(recipeTypeList);
};

function findCheckedBoxes() {
  let tagCheckboxes = document.querySelectorAll(".checked-tag");
  let checkboxInfo = Array.from(tagCheckboxes)
  let selectedTags = checkboxInfo.filter(box => {
    return box.checked;
  });
  findTaggedRecipes(selectedTags);
};

function findTaggedRecipes(selectedTags) {
  let taggedRecipes = [];
  selectedTags.forEach(tag => {
    let allRecipes = recipes.filter(recipe => {
      return recipe.tags.includes(tag.id);
      // return recipe.filterAllRecipes()
    });
    allRecipes.forEach(recipe => {
      if (!taggedRecipes.includes(recipe)) {
        taggedRecipes.push(recipe);
      };
    });
  });
  domUpdates.displayAllRecipes(recipeData);
  if (taggedRecipes.length > 0) {
    filterRecipes(taggedRecipes);
  };
};

function filterRecipes(taggedRecipes) {
  let foundRecipes = recipes.filter(recipe => {
    return !taggedRecipes.includes(recipe);
    console.log(foundRecipes);
  });
  domUpdates.hideUnselectedRecipes(foundRecipes)
};

// *** Favorite Recipes *** //
function addToFavorites(event) {
  domUpdates.addToMyRecipes(event, currentUser, recipeData, ingredientsData);
};

function getSavedRecipes() {
  domUpdates.displaySavedRecipes(recipeData, currentUser);
};

function showRecipes() {
  domUpdates.displayAllRecipes(recipeData);
};

// *** Search Recipes *** //
function pressEnterSearch(event) {
  event.preventDefault();
  searchRecipes();
};

function searchRecipes() {
  let searchInput = document.querySelector("#search-input");
  domUpdates.displayAllRecipes(recipeData);
  let searchedRecipes = recipeData.filter(recipe => {
    return recipe.name.toLowerCase().includes(searchInput.value.toLowerCase().trim());
  });
  filterNonSearched(searchedRecipes);
};

function filterNonSearched(filtered) {
  let found = recipes.filter(recipe => {
    let ids = filtered.map(f => f.id);
    return !ids.includes(recipe.id)
  });
  domUpdates.hideUnselectedRecipes(found);
};


// ************ PANTRY *************** //
function findPantryInfo(ingredientsData) {
  let pantryInfo = [];
  let pantryMatch = currentUser.pantry.map(item => {
    let itemInfo = ingredientsData.find(ingredient => {
      return ingredient.id === item.ingredient;
    });
    let originalIngredient = pantryInfo.find(ingredient => {
      if (itemInfo) {
        return ingredient.name === itemInfo.name;
      };
    });
    if (itemInfo && originalIngredient) {
      originalIngredient.count += item.amount;
    } else if (itemInfo) {
      pantryInfo.push({name: itemInfo.name, count: item.amount});
    };
  });
  domUpdates.displayPantryInfo(pantryInfo.sort((a, b) => a.name.localeCompare(b.name)));
};

// *** Compare Pantry *** //
function determineCookableRecipes() {
  domUpdates.displayAllRecipes(recipeData);
  if (currentUser.pantry.length > 0) {
    recipeData.forEach(recipe => {
      if (!currentUser.determineIngredientsAvailable(recipe)) {
        domUpdates.hideRecipe(recipe);
      };
    });
  };
};

// *** Modify Pantry *** //
function createPantryModifyForm(event) {
  if (event.target && event.target.classList.contains('search-ingredients-btn')) {
    let ingredients = searchPantry();
    domUpdates.displaySearchedIngredients(ingredients);
  };
};

function searchPantry() {
  const searchIngredientsInput = document.getElementById('search-ingredients-input');
  const search = searchIngredientsInput.value.toLowerCase();
  return ingredientsData.filter(ingred => ingred.name).filter(ingred => ingred.name.includes(search));
};

function modifyIngredientCount(event) {
  if (event.target && event.target.id === 'minus') {
    domUpdates.subtractIngredientCount(event);
  };
  if (event.target && event.target.id === 'plus') {
    domUpdates.addIngredientCount(event);
  };
};

function submitPantryChanges(event) {
  if (event.target && event.target.id === 'save-changes-btn') {
    let amounts = Array.from(document.querySelectorAll('.amount'));
    amounts.forEach(amount => {
      if (amount.value && amount.value !== 0) {
        let ingredID = +amount.parentNode.parentNode.id;
        let ingredMod = +amount.value;
        if (ingredMod !== 0) {
          currentUser.updateCurrentUserPantry(ingredID, ingredMod);
          console.log(currentUser.pantry);
          updatePantryIngredients(ingredID, ingredMod)
          if (currentUser.pantry.includes(ingredID)) {
            updatePantryIngredients(ingredID, ingredMod)
          };
        };
      };
    });
    domUpdates.hideModifyPantryForm();
    findPantryInfo(ingredientsData)
  };
};
