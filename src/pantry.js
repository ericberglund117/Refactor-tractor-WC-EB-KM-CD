class Pantry {
  constructor(userID, pantryArray) {
    this.id = userID
    this.contents = pantryArray
  };

  determineIngredientsAvailable(recipe) {
    // let match = recipe.ingredients.map(recipeIngredient => {
    //   return this.contents.find(item => item.ingredient === recipeIngredient.id)
    // })
    // console.log(match)
    // return match.includes(undefined) ? false : true
    return recipe.ingredients.every(recipeIng => {
      let match = this.contents.find(item => item.ingredient === recipeIng.id)
      if(match === undefined) {
        return false
      }
      return recipeIng.quantity.amount <= match.amount
    })

  }

}





export default Pantry
