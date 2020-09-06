import { expect } from 'chai';

import User from '../src/user';
// import users from '../data/users-data';

describe('User', function() {
  let user1;
  let user2;
  let userInfo;
  let recipe;

  beforeEach(function() {
    userInfo = [
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
      },
      {
        "id": 2,
        "name": "Ephraim Goyette",
        "pantry": [
          {
            "ingredient": 6150,
            "amount": 5
          },
          {
            "ingredient": 1032009,
            "amount": 3
          },
          {
            "ingredient": 11979,
            "amount": 5
          },
          {
            "ingredient": 1082047,
            "amount": 1
          },
          {
            "ingredient": 1034053,
            "amount": 4
          },
          {
            "ingredient": 99009,
            "amount": 4
          }]
      }
    ];
    user1 = new User(userInfo[0]);
    user2 = new User(userInfo[1]);

    recipe = {name: 'Chicken Parm', type: ['italian', 'dinner']};
  });

  it('should be a function', function() {
    expect(User).to.be.a('function');
  });

  it('should initialize with an id', function() {
    expect(user1.id).to.eq(1);
  });

  it('should initialize with a name', function() {
    expect(user1.name).to.eq('Saige O\'Kon');
  });

  it('should initialize with a pantry', function() {
    expect(user1.pantry[0].ingredient).to.eq(11477);
  });

  it('should initialize with an empty favoriteRecipes array', function() {
    expect(user1.favoriteRecipes).to.deep.equal([]);
  });

  it('should initialize with an empty recipesToCook array', function() {
    expect(user1.recipesToCook).to.deep.equal([]);
  });

  it('should be able to save a recipe to favoriteRecipes', function() {
    user.saveRecipe(recipe);
    expect(user.favoriteRecipes[0].name).to.equal('Chicken Parm');
  });

  it('should be able to decide to cook a recipe', function() {
    user.decideToCook(recipe);
    expect(user.recipesToCook[0].name).to.equal('Chicken Parm');
  });

  it('should be able to filter recipes by type', function() {
    user.saveRecipe(recipe);
    expect(user.filterRecipes('italian')).to.deep.equal([recipe]);
  });

  it('should be able to search recipes by name', function() {
    user.saveRecipe(recipe);
    expect(user.searchForRecipe('Chicken Parm')).to.deep.equal([recipe]);
  });
});
