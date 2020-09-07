import { expect } from 'chai';

import Recipe from '../src/recipe';


describe('Recipe', function() {
  let recipe;
  let recipe1;
  let recipeInfo;
  let recipeInfo1;
  let ingredientsDataTest;

  beforeEach(function() {
    recipeInfo =
      {
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

    recipeInfo1 =
      {
        "name": "Maple Dijon Apple Cider Grilled Pork Chops",
        "id": 678353,
        "image": "https://spoonacular.com/recipeImages/678353-556x370.jpg",
        "ingredients": [
          {
            "name": "apple cider",
            "id": 1009016,
            "quantity": {
              "amount": 1.5,
              "unit": "cups"
            }
          },
          {
            "name": "apples",
            "id": 9003,
            "quantity": {
              "amount": 2,
              "unit": ""
            }
          }
        ]
      };

      ingredientsDataTest = [
        {
          "id": 20081,
          "name": "wheat flour",
          "estimatedCostInCents": 142
        },
        {
          "id": 18372,
          "name": "bicarbonate of soda",
          "estimatedCostInCents": 582
        }
      ];

    recipe = new Recipe(recipeInfo);
    recipe1 = new Recipe(recipeInfo1)
  })

  it('is a function', function() {
    expect(Recipe).to.be.a('function');
  });

  it('should be an instance of Recipe', function() {
    expect(recipe).to.be.an.instanceof(Recipe);
  });

  it('should initialize with an id', function() {
    expect(recipe.id).to.equal(595736);
  });

  it('should initialize with an name', function() {
    expect(recipe.name).to.equal('Loaded Chocolate Chip Pudding Cookie Cups');
  });

  it('should initialize with an image', function() {
    expect(recipe.image).to.equal('https://spoonacular.com/recipeImages/595736-556x370.jpg');
  });

  it('should initialize with an array of ingredients', function() {
    const ingredient = {
      "id": 20081,
      "name": "all purpose flour",
      "quantity": {
        "amount": 1.5,
        "unit": "c"
      }
    }
    expect(recipe.ingredients[0]).to.deep.eq(ingredient);
  });

  it('should calculate the total cost of all of the ingredients', function() {
    expect(recipe.calculateIngredientsCost(ingredientsDataTest)).to.equal(504);
  });
});
