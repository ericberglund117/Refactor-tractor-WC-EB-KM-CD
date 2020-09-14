
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

  
})
