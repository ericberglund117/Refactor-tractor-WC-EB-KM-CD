import ingredientsData from '../src/data/ingredient-Data.js'

class Recipe {
  constructor(recipe) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.image = recipe.image;
    this.tags = recipe.tags;
    this.ingredients = recipe.ingredients;
    // this.ingredientsData =
  };

  calculateIngredientsCost(ingredientsData) {
    //   let match = this.ingredients.map(i => {
    //     console.log(i)
    //     ingredientsData.find(ingredient => ingredient.id === i.id);
    // });
    // console.log(match)
    let sum = 0;
    let match = this.ingredients.forEach(recipeIngredient => {
      // Object.entries(recipeIngredient)
      let anything = ingredientsData.find(ingredient => ingredient.id === recipeIngredient.id)
      console.log(anything)
      // ingredient.id === ingredientsData[index].id
    })
    // console.log(match)

    // let cost = this.ingredients.reduce((sum, currentIngredient) => {
    //   // console.log(currentIngredient)
    //     sum += ingredient.estimatedCostInCents
    //   return sum;
    // }, 0)

    // console.log(cost)
  };
  //input- this.ingredients(recipe ingredients) && ingredientsData
  //output - return sum of ingredient costs of recipe
  //methods - map, reduce
}

export default Recipe;
