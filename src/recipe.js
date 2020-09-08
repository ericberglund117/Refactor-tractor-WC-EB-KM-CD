import ingredientsData from '../src/data/ingredient-Data.js'
import recipeData from '../src/data/recipe-Data.js'

class Recipe {
  constructor(recipe) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.image = recipe.image;
    this.tags = recipe.tags;
    this.ingredients = recipe.ingredients;
  };

  calculateIngredientsCost(ingredientsData) {
    let cost = this.ingredients.map(recipeIngredient => {
      let recipeAmount = recipeIngredient.quantity.amount;
      let match = ingredientsData.find(ingredient => ingredient.id === recipeIngredient.id)
      return match.estimatedCostInCents * recipeAmount
    })
    let totalCost = cost.reduce((sum, ingredientCost) => {
      sum += ingredientCost
      return sum
    }, 0);
    return totalCost
  };

  filterAllRecipes(recipe, tag) {
    if(recipe.tags.includes(tag)) {
      return recipe
    }
 };

 searchRecipes(recipe, ingredient) {
   let ingredientsValues = Object.values(recipe.ingredients)
   let ingredientsList = ingredientsValues.map(ingredient => ingredient.name)
   if(ingredientsList.includes(ingredient)) {
     return recipe
   }
 };

getInstructions(recipe) {
  return recipe.instructions
 };
};

export default Recipe;
