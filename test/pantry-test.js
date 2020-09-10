import { expect } from 'chai';

import Pantry from '../src/pantry';
import User from '../src/user';
import Recipe from '../src/recipe';


describe('Pantry', function() {
  let userInfo
  let user
  let userPantry
  let recipeInfo1
  let recipe1
  let recipeInfo2
  let recipe2


  beforeEach(function() {
    userInfo = {
      "id": 1,
      "name": "Saige O'Kon",
      "pantry": [
        {
          "ingredient": 11477,
          "amount": 1.5
        },
        {
          "ingredient": 93820,
          "amount": 1
        },
        {
          "ingredient": 11297,
          "amount": 3
        },
        {
          "ingredient": 11547,
          "amount": 5
        },
        {
          "ingredient": 1082047,
          "amount": 5
        }]
      }
    user = new User(userInfo)
    recipeInfo1 = {
      "name": "Loaded Chocolate Chip Pudding Cookie Cups",
      "id": 595736,
      "image": "https://spoonacular.com/recipeImages/595736-556x370.jpg",
      "ingredients": [
        {
          "name": "all purpose flour",
          "id": 20081,
          "quantity": {
            "amount": 1.5,
            "unit": "c"
          }
        },
        {
          "name": "baking soda",
          "id": 18372,
          "quantity": {
            "amount": 0.5,
            "unit": "tsp"
          }
        }
      ]
    };
    recipeInfo2 = {
      "name": "Loaded Chocolate Chip Pudding Cookie Cups",
      "id": 595736,
      "image": "https://spoonacular.com/recipeImages/595736-556x370.jpg",
      "ingredients": [
        {
          "name": "zucchini squash",
          "id": 11477,
          "quantity": {
            "amount": 1.5,
            "unit": "c"
          }
        },
        {
          "name": "flat leaf parsley leaves",
          "id": 11297,
          "quantity": {
            "amount": 0.5,
            "unit": "tsp"
          }
        }
      ]
    };
    recipe1 = new Recipe(recipeInfo1)
    recipe2 = new Recipe(recipeInfo2)
    userPantry = new Pantry(user.id, user.pantry)
  });

  it('should be a function', () => {
    expect(Pantry).to.be.a('function');
  });

  it('should be an instance of Pantry', () => {
    expect(userPantry).to.be.an.instanceof(Pantry)
  });

  it('should determine whether a Pantry has enough ingredients to cook a given meal', () => {
    expect(userPantry.determineIngredientsAvailable(recipe2)).to.equal(true)
    expect(userPantry.determineIngredientsAvailable(recipe1)).to.equal(false)
  })

  describe('createShoppingListForRecipe', function() {
    it('should determine the ingredients needed to cook a given meal based on what is in my pantry', () => {
      const expected = [
        {name: "all purpose flour", id: 20081, amountNeeded: 1.5},
        {name: "baking soda", id: 18372, amountNeeded: 0.5}
      ];
      expect(userPantry.createShoppingListForRecipe(recipe1)).to.deep.equal(expected)
    })
    it('should return an empty list if no ingredients are needed to cook a given meal based on what is in my pantry', () => {
      expect(userPantry.createShoppingListForRecipe(recipe2)).to.deep.equal([])
    })

  })
  describe('calculateShoppingListCost', function() {
    it('should determine the total cost of ingredients needed to cook a recipe', () => {
      expect(userPantry.calculateShoppingListCost(recipe1)).to.equal('$5.04')
    })
  })
});
