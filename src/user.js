class User {
  constructor(user) {
    this.id = user.id
    this.name = user.name;
    this.pantry = user.pantry;
    this.favoriteRecipes = [];
    this.recipesToCook = [];
    this.recipesCooked = [];
  };

  saveRecipe(recipe) {
    if(recipe !== undefined) this.favoriteRecipes.push(recipe);
  };

  removeRecipe(recipe) {
    let i = this.favoriteRecipes.indexOf(recipe);
    this.favoriteRecipes.splice(i, 1);
  };

  decideToCook(recipe) {
    if(recipe === undefined) {
      return undefined
    }
    (this.determineIngredientsAvailable(recipe) ? this.recipesToCook.push(recipe) : this.createShoppingListForRecipe(recipe))
  };

  filterRecipes(type, recipeList) {
    if(type !== undefined) {
     return recipeList.filter(recipe => recipe.type.includes(type));
   } else {
     return null
   };
  };

  searchForRecipe(keyword) {
    if(keyword !== undefined) {
      return this.favoriteRecipes.filter(recipe => recipe.name.includes(keyword) || recipe.ingredients.includes(keyword));
    } else {
    return null
  };
  };

  determineIngredientsAvailable(recipe) {
    return recipe.ingredients.every(recipeIng => {
      let match = this.pantry.find(item => item.ingredient === recipeIng.id)
      if(match === undefined) {
        return false
      }
      recipeIng.quantity.amount <= match.amount
    })
  };

  createShoppingListForRecipe(recipe) {
    if(this.determineIngredientsAvailable(recipe)) {
      return []
    }
    return recipe.ingredients.filter(recipeIng => {
      let match = this.pantry.find(pantryIng => pantryIng.ingredient === recipeIng.id)
      if(match === undefined) {
        return true
      }
      return recipeIng.quantity.amount > match.amount
    }).map(listItem => {
      let match = this.pantry.find(pantryIng => pantryIng.ingredient === listItem.id)
      return match === undefined ?
      {name: listItem.name, id: listItem.id, amountNeeded: listItem.quantity.amount} :
      {name: listItem.name, id: listItem.id, amountNeeded: listItem.quantity.amount - match.amount}
    })
  };

  calculateShoppingListCost(recipe, ingredientsData) {
    let shoppingList = this.createShoppingListForRecipe(recipe)
    if(shoppingList.length === 0) {
      return '$0.00'
    }
    let totalCosts = shoppingList.map(listItem => {
      let cost = ingredientsData.find(ingredient => ingredient.id === listItem.id).estimatedCostInCents
      let itemCost = (cost * listItem.amountNeeded) / 100
      return itemCost
    })
    let priceTotal = totalCosts.reduce((sum, price) => sum + price, 0)
    return `$${parseFloat((priceTotal).toFixed(2))}`
  };

  updateCurrentUserPantry(id, ingredValue) {
    let ingredMatch = this.pantry.find(ingredient => ingredient.ingredient === id)
    if(!ingredMatch) {
      this.pantry.push({ingredient: id, amount: 0})
    }
    this.pantry.forEach((ingredient, index) => {
      if(ingredient.ingredient === id) {
        ingredient.amount += +ingredValue
      }
      if(ingredient.amount <= 0) {
        this.pantry.splice(index, 1)
      };
    })
  }

  // removeIngredientsFromPantry(recipe) {
  //   console.log(this.recipesToCook[this.recipesToCook.length - 1].ingredients);
  //   console.log(this.pantry)
  //   return recipe.recipesToCook.filter(recipeIng => {
  //     let match = this.pantry.find(pantryIng => pantryIng.ingredient === recipeIng.id)
  //     if(match === undefined) {
  //       return true
  //     }
  //     console.log(match)
  //     return recipeIng.quantity.amount - match.amount
  // });
};

export default User;
