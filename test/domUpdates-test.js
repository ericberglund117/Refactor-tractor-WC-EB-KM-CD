
const chai = require('chai')
const spies = require('chai-spies');
chai.use(spies);
import { expect } from 'chai';
import domUpdates from '../src/domUpdates';

describe('domUpdates', function() {
  let currentUser
  let recipeData
  let ingredientsData
  let mockEvent
  beforeEach(function() {
    currentUser = [
      {
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
      }];

    recipeData =
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

    ingredientsData = [
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

    mockEvent = {type: "click"}

  });

  afterEach(function() {
    chai.spy.restore(domUpdates);
  });

  it('should display a welcome message', () => {
    chai.spy.on(domUpdates, ['welcomeUser'], () => {});

    domUpdates.welcomeUser(currentUser);

    expect(domUpdates.welcomeUser).to.have.been.called(1);
    expect(domUpdates.welcomeUser).to.have.been.called.with(currentUser);
  })

  it('should display a recipe card on the main page', () => {
    chai.spy.on(domUpdates, ['displayCard'], () => {});

    domUpdates.displayCard(recipeData, recipeData["name"]);

    expect(domUpdates.displayCard).to.have.been.called(1);
    expect(domUpdates.displayCard).to.have.been.called.with(recipeData, recipeData["name"]);
  })

  it('should display recipe type tags and check boxes', () => {
    chai.spy.on(domUpdates, ['listTags'], () => {});

    let tags = ["antipasti", "antipasto", "appetizer", "breakfast"]
    domUpdates.listTags(tags);

    expect(domUpdates.listTags).to.have.been.called(1);
    expect(domUpdates.listTags).to.have.been.called.with(tags);
  })

  it('should hide any recipes that are not selected', () => {
    chai.spy.on(domUpdates, ['hideUnselectedRecipes'], () => {});

    domUpdates.hideUnselectedRecipes(recipeData);

    expect(domUpdates.hideUnselectedRecipes).to.have.been.called(1);
    expect(domUpdates.hideUnselectedRecipes).to.have.been.called.with(recipeData);
  })

  it('should display saved recipes', () => {
    chai.spy.on(domUpdates, ['showSavedRecipes'], () => {});

    domUpdates.showSavedRecipes(recipeData, currentUser);

    expect(domUpdates.showSavedRecipes).to.have.been.called(1);
    expect(domUpdates.showSavedRecipes).to.have.been.called.with(recipeData, currentUser);
  })

  it('should display recipe info', () => {
    chai.spy.on(domUpdates, ['openRecipeInfo'], () => {});

    domUpdates.openRecipeInfo(mockEvent, recipeData, ingredientsData);

    expect(domUpdates.openRecipeInfo).to.have.been.called(1);
    expect(domUpdates.openRecipeInfo).to.have.been.called.with(mockEvent, recipeData, ingredientsData);
  })

  it('should display recipe title', () => {
    chai.spy.on(domUpdates, ['generateRecipeTitle'], () => {});
    let fullRecipeInfo = {}

    domUpdates.generateRecipeTitle(recipeData, ingredientsData, fullRecipeInfo);

    expect(domUpdates.generateRecipeTitle).to.have.been.called(1);
    expect(domUpdates.generateRecipeTitle).to.have.been.called.with(recipeData, ingredientsData, fullRecipeInfo);
  })

  it('should display recipe image', () => {
    chai.spy.on(domUpdates, ['addRecipeImage'], () => {});

    domUpdates.addRecipeImage(recipeData);

    expect(domUpdates.addRecipeImage).to.have.been.called(1);
    expect(domUpdates.addRecipeImage).to.have.been.called.with(recipeData);
  })

  it('should display recipe instructions', () => {
    chai.spy.on(domUpdates, ['displayInstructions'], () => {});
    let fullRecipeInfo = {}

    domUpdates.displayInstructions(recipeData, fullRecipeInfo);

    expect(domUpdates.displayInstructions).to.have.been.called(1);
    expect(domUpdates.displayInstructions).to.have.been.called.with(recipeData, fullRecipeInfo);
  })

  it('should display all recipes', () => {
    chai.spy.on(domUpdates, ['showAllRecipes'], () => {});

    domUpdates.showAllRecipes(recipeData);

    expect(domUpdates.showAllRecipes).to.have.been.called(1);
    expect(domUpdates.showAllRecipes).to.have.been.called.with(recipeData);
  })

  it('should display pantry info', () => {
    chai.spy.on(domUpdates, ['displayPantryInfo'], () => {});

    domUpdates.displayPantryInfo(currentUser.pantry);

    expect(domUpdates.displayPantryInfo).to.have.been.called(1);
    expect(domUpdates.displayPantryInfo).to.have.been.called.with(currentUser.pantry);
  })

  it('should display searched ingredients', () => {
    chai.spy.on(domUpdates, ['displaySearchedIngredients'], () => {});

    domUpdates.displaySearchedIngredients(ingredientsData);

    expect(domUpdates.displaySearchedIngredients).to.have.been.called(1);
    expect(domUpdates.displaySearchedIngredients).to.have.been.called.with(ingredientsData);
  })

  it('should display negative ingredient increment', () => {
    chai.spy.on(domUpdates, ['subtractIngredientCount'], () => {});

    domUpdates.subtractIngredientCount(mockEvent);

    expect(domUpdates.subtractIngredientCount).to.have.been.called(1);
    expect(domUpdates.subtractIngredientCount).to.have.been.called.with(mockEvent);
  })

  it('should display positive ingredient increment', () => {
    chai.spy.on(domUpdates, ['addIngredientCount'], () => {});

    domUpdates.addIngredientCount(mockEvent);

    expect(domUpdates.addIngredientCount).to.have.been.called(1);
    expect(domUpdates.addIngredientCount).to.have.been.called.with(mockEvent);
  })

  it('should display favorited icon status', () => {
    chai.spy.on(domUpdates, ['addToMyRecipes'], () => {});

    domUpdates.addToMyRecipes(mockEvent, currentUser, recipeData, ingredientsData);

    expect(domUpdates.addToMyRecipes).to.have.been.called(1);
    expect(domUpdates.addToMyRecipes).to.have.been.called.with(mockEvent, currentUser, recipeData, ingredientsData);
  })

  it('should hide unchecked recipes', () => {
    chai.spy.on(domUpdates, ['hideUncheckedRecipe'], () => {});

    domUpdates.hideUncheckedRecipe(recipeData);

    expect(domUpdates.hideUncheckedRecipe).to.have.been.called(1);
    expect(domUpdates.hideUncheckedRecipe).to.have.been.called.with(recipeData);
  })
})
