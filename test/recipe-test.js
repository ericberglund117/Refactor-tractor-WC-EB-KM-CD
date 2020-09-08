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
        ],
        "instructions": [
          {
            "number": 1,
            "instruction": "In a large mixing bowl, whisk together the dry ingredients (flour, pudding mix, soda and salt). Set aside.In a large mixing bowl of a stand mixer, cream butter for 30 seconds. Gradually add granulated sugar and brown sugar and cream until light and fluffy."
          },
          {
            "number": 2,
            "instruction": "Add egg and vanilla and mix until combined."
          },
        ],
        "tags": [
          "antipasti",
          "starter",
          "snack",
          "appetizer",
          "antipasto",
          "hor d'oeuvre"
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
        ],
        "instructions": [
          {
            "number": 1,
            "instruction": "Season the pork chops with salt and pepper and grill or pan fry over medium high heat until cooked, about 3-5 minutes per side. (If grilling, baste the chops in the maple dijon apple cider sauce as you grill.)Meanwhile, mix the remaining ingredients except the apple slices, bring to a simmer and cook until the sauce thickens, about 2-5 minutes.Grill or saute the apple slices until just tender but still crisp.Toss the pork chops and apple slices in the maple dijon apple cider sauce and enjoy!"
          }
        ],
        "tags": [
          "lunch",
          "main course",
          "main dish",
          "dinner"
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
    expect(recipe.ingredients[0]).to.deep.equal(ingredient);
  });

  it('should calculate the total cost of all of the ingredients', function() {
    expect(recipe.calculateIngredientsCost(ingredientsDataTest)).to.equal(504);
  });

  it('should be able to filter recipes by tag/type', function() {
    expect(recipe.filterAllRecipes(recipeInfo, 'starter')).to.equal(recipeInfo);
    expect(recipe.filterAllRecipes(recipeInfo1, 'dinner')).to.equal(recipeInfo1);
  });

  it('should be able to search recipes by ingredients', function() {
    expect(recipe.searchRecipes(recipeInfo, 'baking soda')).to.equal(recipeInfo);
    expect(recipe.searchRecipes(recipeInfo1, 'apple cider')).to.equal(recipeInfo1);
  });

  it('the getInstructions function should return the recipe instructions', function() {
    expect(recipe.getInstructions(recipeInfo)).to.equal(recipeInfo.instructions);
    expect(recipe.getInstructions(recipeInfo1)).to.equal(recipeInfo1.instructions);
  })
});
