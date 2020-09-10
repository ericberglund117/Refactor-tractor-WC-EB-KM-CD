class Pantry {
  constructor(userID, pantryArray) {
    this.id = userID
    this.contents = pantryArray
  };

  determineIngredientsAvailable(recipe) {
    return recipe.ingredients.every(recipeIng => {
      let match = this.contents.find(item => item.ingredient === recipeIng.id)
      if(match === undefined) {
        return false
      }
      return recipeIng.quantity.amount <= match.amount
    })
  }
  createShoppingListForRecipe(recipe) {
    if(this.determineIngredientsAvailable(recipe)) {
      return []
    }
    return recipe.ingredients.filter(recipeIng => {
      let match = this.contents.find(pantryIng => pantryIng.ingredient === recipeIng.id)
      if(match === undefined) {
        return true
      }
      return recipeIng.quantity.amount > match.amount
    }).map(listItem => {
      let match = this.contents.find(pantryIng => pantryIng.ingredient === listItem.id)
      return match === undefined ?
      {name: listItem.name, id: listItem.id, amountNeeded: listItem.quantity.amount} :
      {name: listItem.name, id: listItem.id, amountNeeded: listItem.quantity.amount - match.amount}
    })
  }
}





export default Pantry
