import { expect } from 'chai';

import Pantry from '../src/pantry';
import User from '../src/user';
import Recipe from '../src/recipe';


describe('Pantry', function() {
  let userInfo
  let user
  let userPantry
  let recipeInfo
  let recipe


  beforeEach(function() {
    let userInfo = {
      "id": 1,
      "name": "Saige O'Kon",
      "pantry": [
        {
          "ingredient": 11477,
          "amount": 1
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
    recipeInfo = {
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
    recipe = new Recipe(recipeInfo)
    userPantry = new Pantry(user.id, user.pantry)
  });

  it('should be a function', () => {
    expect(Pantry).to.be.a('function');
  });

  it('should be an instance of Pantry', () => {
    expect(userPantry).to.be.an.instanceof(Pantry)
  })
});
