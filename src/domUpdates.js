let domUpdates = {
  welcomeUser(currentUser) {
    let firstName = currentUser.name.split(" ")[0];
    let welcomeMsg = `
      <div class="welcome-msg">
        <h1>Welcome ${firstName}!</h1>
      </div>`;
    document.querySelector(".banner-image").insertAdjacentHTML("afterbegin",
      welcomeMsg);
  },

  // ************ RECIPES *************** //
  displayRecipeCard(recipeInfo, shortRecipeName) {
    let main = document.querySelector("main");
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
  },

  displayRecipeTags(recipeTypeList) {
    let tagList = document.querySelector(".tag-list");
    recipeTypeList.forEach(tag => {
      let tagHtml = `<li><input type="checkbox" class="checked-tag" id="${tag}">
      <label for="${tag}">${this.capitalize(tag)}</label></li>`;
      tagList.insertAdjacentHTML("beforeend", tagHtml);
    });
  },

  hideUnselectedRecipes(foundRecipes) {
    foundRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
  },

  displaySavedRecipes(recipeData, user) {
    let unsavedRecipes = recipeData.filter(recipe => {
      return !user.favoriteRecipes.includes(recipe.id);
    });
    unsavedRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
    this.showMyRecipesBanner();
  },

  openRecipeInfo(event, recipeData, ingredientsData) {
    let fullRecipeInfo = document.querySelector(".recipe-instructions");
    fullRecipeInfo.style.display = "inline";
    fullRecipeInfo.innerHTML = ''
    let recipeId = event.composedPath().find(event => event.id).id;
    let recipe = recipeData.find(recipe => recipe.id === +recipeId);
    this.displayRecipeTitle(recipe, this.generateIngredients(recipe, ingredientsData), fullRecipeInfo);
    this.addRecipeImage(recipe);
    this.displayInstructions(recipe, fullRecipeInfo);
    fullRecipeInfo.insertAdjacentHTML("beforebegin", "<section id='overlay'></div>");
  },

  displayRecipeTitle(recipe, ingredients, fullRecipeInfo) {
    let recipeTitle = `
    <button id="exit-recipe-btn">X</button>
    <h3 id="recipe-title">${recipe.name}</h3>
    <h4>Ingredients</h4>
    <p>${ingredients}</p>`
    fullRecipeInfo.insertAdjacentHTML("beforeend", recipeTitle);
  },

  addRecipeImage(recipe) {
    document.getElementById("recipe-title").style.backgroundImage = `url(${recipe.image})`;
  },

  generateIngredients(recipe, ingredientsData) {
    return recipe && recipe.ingredients.map(ingredient => {
      let ingredientInfo = ingredientsData.find(dataIng => dataIng.id === ingredient.id);
      return `${domUpdates.capitalize(ingredientInfo.name)} (${ingredient.quantity.amount} ${ingredient.quantity.unit})`
    }).join(", ");
  },

  displayInstructions(recipe, fullRecipeInfo) {
    let instructionsList = "";
    let instructions = recipe.instructions.map(i => {
      return i.instruction
    });
    instructions.forEach(i => {
      instructionsList += `<li>${i}</li>`
    });
    fullRecipeInfo.insertAdjacentHTML("beforeend", "<h4>Instructions</h4>");
    fullRecipeInfo.insertAdjacentHTML("beforeend", `<ol>${instructionsList}</ol>`);
  },

  exitRecipe() {
    let fullRecipeInfo = document.querySelector(".recipe-instructions");
    fullRecipeInfo.style.display = "none";
    document.getElementById("overlay").remove();
  },

  displayAllRecipes(recipeData) {
    recipeData.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "block";
    });
    this.showWelcomeBanner();
  },

  hideRecipe(recipe) {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  },

  // ************ PANTRY *************** //
  displayPantryInfo(pantry) {
    let pantryList = document.querySelector(".pantry-list")
    pantryList.innerHTML = ''
    pantry.forEach(ingredient => {
      let ingredientHtml = `<li class="pantry-ingredient" id="${ingredient.name}">
      <label for="${ingredient.name}">${ingredient.name}, ${ingredient.count}</label></li>`;
      pantryList.innerHTML += ingredientHtml
    });
  },

  displayModifyPantryForm() {
    document.getElementById('post-to-pantry').style.display = 'flex';
    let amounts = Array.from(document.querySelectorAll('.amount'));
    amounts.forEach(amount => amount.value = 0)
  },

  hideModifyPantryForm() {
    document.getElementById('post-to-pantry').style.display = 'none';
  },

  // PANTRY MODIFICATION MENU
  displaySearchedIngredients(ingredients) {
    let results = document.getElementById('searched-ingredient-results');
    results.innerHTML = '';
    ingredients.forEach(ingredient => {
      results.insertAdjacentHTML('afterbegin', `
      <div class="searched-ingredient" id="${ingredient.id}">
      <div id="add-subtract">
      <button id="minus">-</button>
      <input class="amount" placeholder="value..." value=0>
      <button id="plus">+</button>
      </div>
      <p id="ingred-name">${ingredient.name}</p>
      </div>
      `);
    });
  },

  subtractIngredientCount(event) {
    let amount = event.target.nextSibling.nextSibling;
    amount.value--;
  },

  addIngredientCount(event) {
    let amount = event.target.previousSibling.previousSibling;
    amount.value++;
  },

  // ************ HELPERS *************** //
  capitalize(words) {
    return words.split(" ").map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");
  },

  isDescendant(parent, child) {
    let node = child;
    while (node !== null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  },

  // TOGGLE DISPLAYS
  showMyRecipesBanner() {
    document.querySelector(".welcome-msg").style.display = "none";
    document.querySelector(".my-recipes-banner").style.display = "block";
  },

  showWelcomeBanner() {
    document.querySelector(".welcome-msg").style.display = "flex";
    document.querySelector(".my-recipes-banner").style.display = "none";
  },

  toggleMenu() {
    var menuDropdown = document.querySelector(".drop-menu");
    if (menuDropdown.style.display === "none") {
      menuDropdown.style.display = "block";
    } else {
      menuDropdown.style.display = "none";
    }
  }
};

export default domUpdates;
