class Recipe {
  constructor(recipe) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.image = recipe.image;
    this.tags = recipe.tags;
    this.ingredients = recipe.ingredients;
    this.instructions = recipe.instructions;
  }

  calculateIngredientsCost(ingredientsData) {
    let cost = this.ingredients.map(recipeIngredient => {
      let recipeAmount = recipeIngredient.quantity.amount;
      let match = ingredientsData.find(ingredient =>
        ingredient.id === recipeIngredient.id);
      return match.estimatedCostInCents * recipeAmount;
    })
    let totalCost = cost.reduce((sum, ingredientCost) => {
      sum += ingredientCost;
      return sum;
    }, 0);
    return totalCost;
  }

  determineRecipeTag(tag) {
    if (this.tags.includes(tag)) {
      return true
    } else {
      return false
    }
  }

  searchRecipes(recipe, ingredient) {
    let ingredientsValues = Object.values(recipe.ingredients)
    let ingredientsList = ingredientsValues.map(ingredient => ingredient.name)
    if (ingredientsList.includes(ingredient)) {
      return recipe
    }
  }

  getInstructions(recipe) {
    return recipe.instructions
  }
}

export default Recipe;
