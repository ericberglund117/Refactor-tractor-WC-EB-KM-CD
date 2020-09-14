let domUpdates = {
  // GENERATE A USER ON LOAD
  generateUser(currentUser) {
    let firstName = currentUser.name.split(" ")[0];
    let welcomeMsg = `
      <div class="welcome-msg">
        <h1>Welcome ${firstName}!</h1>
      </div>`;
    document.querySelector(".banner-image").insertAdjacentHTML("afterbegin",
      welcomeMsg);
  },

  // Create Recipe Cards

  displayCard(recipeInfo, shortRecipeName) {
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

// FILTER BY RECIPE TAGS

  listTags(allTags) {
    let tagList = document.querySelector(".tag-list");
    allTags.forEach(tag => {
      let tagHtml = `<li><input type="checkbox" class="checked-tag" id="${tag}">
        <label for="${tag}">${this.capitalize(tag)}</label></li>`;
      tagList.insertAdjacentHTML("beforeend", tagHtml);
    });
  },

  capitalize(words) {
    console.log(typeof words);
    return words.split(" ").map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");
  },

  hideUnselectedRecipes(foundRecipes) {
    foundRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
  },

// FAVORITE RECIPE FUNCTIONALITY

  showSavedRecipes(recipeData, user) {
    let unsavedRecipes = recipeData.filter(recipe => {
      return !user.favoriteRecipes.includes(recipe.id);
    });
    unsavedRecipes.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    });
    this.showMyRecipesBanner();
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

  // CREATE RECIPE INSTRUCTIONS
  openRecipeInfo(event, recipeData, ingredientsData) {
    let fullRecipeInfo = document.querySelector(".recipe-instructions");
    fullRecipeInfo.style.display = "inline";
    let recipeId = event.composedPath().find(e => e.id).id;
    let recipe = recipeData.find(recipe => recipe.id === Number(recipeId));
    this.generateRecipeTitle(recipe, this.generateIngredients(recipe, ingredientsData), fullRecipeInfo);
    this.addRecipeImage(recipe);
    this.generateInstructions(recipe, fullRecipeInfo);
    fullRecipeInfo.insertAdjacentHTML("beforebegin", "<section id='overlay'></div>");
  },

  generateRecipeTitle(recipe, ingredients, fullRecipeInfo) {
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

  generateInstructions(recipe, fullRecipeInfo) {
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
    while (fullRecipeInfo.firstChild &&
      fullRecipeInfo.removeChild(fullRecipeInfo.firstChild));
    fullRecipeInfo.style.display = "none";
    document.getElementById("overlay").remove();
  },

  showAllRecipes(recipeData) {
    recipeData.forEach(recipe => {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "block";
    });
    this.showWelcomeBanner();
  },

//Search RECIPES
  toggleMenu() {
    // let menuOpen = false;
    var menuDropdown = document.querySelector(".drop-menu");
    // menuOpen = !menuOpen;
    if (menuDropdown.style.display === "none") {
      menuDropdown.style.display = "block";
    } else {
      menuDropdown.style.display = "none";
    }
  }
}



export default domUpdates;