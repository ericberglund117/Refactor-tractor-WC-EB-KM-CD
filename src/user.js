class User {
  constructor(user) {
    this.id = user.id
    this.name = user.name;
    this.pantry = user.pantry;
    this.favoriteRecipes = [];
    this.recipesToCook = [];
  };

  saveRecipe(recipe) {
    if(recipe !== undefined) this.favoriteRecipes.push(recipe);
  };

  removeRecipe(recipe) {
    let i = this.favoriteRecipes.indexOf(recipe);
    this.favoriteRecipes.splice(i, 1);
  };

  decideToCook(recipe) {
    if(recipe !== undefined) this.recipesToCook.push(recipe);
  };

  filterRecipes(type) {
    if(type !== undefined) {
     return this.favoriteRecipes.filter(recipe => recipe.type.includes(type));
   } else {
     return null
   }
  };

  searchForRecipe(keyword) {
    if(keyword !== undefined) {
      return this.favoriteRecipes.filter(recipe => recipe.name.includes(keyword) || recipe.ingredients.includes(keyword));
    } else {
    return null
    }
  }
};

module.exports = User;
