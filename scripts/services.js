let baseRecipes;

getData().then(recipes => {
  baseRecipes = recipes;
});

const recipeSearch = {
  // TODO: Change all baseRecipes to recipeSearch.baseRecipes
  // baseRecipes: baseRecipes,
  commonSearch: '',
  filteredRecipes: [],
  ingredientsSearch: '',
  ingredientsSET: [],
  ingredientsTags: [],
  applianceSearch: '',
  utensilsSearch: '',
  utensilsTags: [],
};

// KEEP
const filterAll = (data, searchTerm) => {
  const results = data.filter(({ name, ingredients, description }) => {
    return (
      name.includes(searchTerm) ||
      ingredients.some(i => i.ingredient.includes(searchTerm)) ||
      description.includes(searchTerm)
    );
  });
  return results;
};

// KEEP
const filterRecipesByIngredientTag = recipes => {
  return recipes.filter(recipe => {
    const ingredients = recipe.ingredients.map(ingredient => ingredient.ingredient);
    return recipeSearch.ingredientsTags.every(tag => ingredients.includes(tag));
  });
};

// KEEP
const filterIngredientsForList = data => {
  let ingredientsList = [];
  let ingredientsSET;
  data.map(({ ingredients }) => {
    ingredients.map(({ ingredient }) => ingredientsList.push(ingredient));
    ingredientsSET = [...new Set(ingredientsList)];
  });
  return ingredientsSET;
};

// KEEP
const createIngredientsTags = () => {
  const ingredientsTags = document.querySelector('.ingredients-tags');
  const ingredientsItems = document.querySelectorAll('.ingredients-item');

  // Adding eventlistener on ingredients list
  ingredientsItems.forEach(i => {
    i.addEventListener('click', () => {
      const tag = i.textContent;
      if (!recipeSearch.ingredientsTags.includes(tag)) {
        recipeSearch.ingredientsTags.push(tag);

        // Creating ingredients tags
        const ingredientTag = document.createElement('span');
        ingredientTag.classList.add('ingredient-tag');
        ingredientTag.innerHTML = `<p class="tag">${tag}</p><i class="close-index fa-regular fa-circle-xmark"></i>`;
        ingredientsTags.appendChild(ingredientTag);

        // Populate and update filteredRecipes Array
        recipeSearch.filteredRecipes = filterRecipesByIngredientTag(baseRecipes);

        createIngredientsDOM(filterIngredientsForList(recipeSearch.filteredRecipes));
        createCardsDOM(recipeSearch.filteredRecipes);
      }
    });
  });
};

const filterRecipesByNames = (recipeSearch, name) => {
  return recipeSearch.every(searchValue => {
    return name.includes(searchValue);
  });
};

const filterRecipesByIngredients = (recipeSearch, ingredients) => {
  const ingredientsArray = ingredients.map(i => i.ingredient);
  return recipeSearch.every(searchValue => ingredientsArray.some(ingredient => ingredient.includes(searchValue)));
};

const filterRecipesByDescription = (recipeSearch, description) => {
  return recipeSearch.every(searchValue => {
    return description.includes(searchValue);
  });
};

const filterRecipes = (data, recipeSearch) => {
  const results = data.filter(({ name, ingredients, description }) => {
    return (
      filterRecipesByNames(recipeSearch, name) ||
      filterRecipesByIngredients(recipeSearch, ingredients) ||
      filterRecipesByDescription(recipeSearch, description)
    );
  });

  return results;
};

const filterIngredients = (data, term) => {
  const results = data.filter(({ ingredients }) => {
    return ingredients.some(i => i.ingredient.includes(term));
  });
  return results;
};

// KEEP
const createCardsDOM = filteredData => {
  const results = document.getElementById('results');
  results.innerHTML = '';

  if (filteredData.length === 0) {
    recipesNotFound.innerHTML = `Aucune recette ne correspond à votre critère &#9785;. Vous pouvez chercher « coco », « poisson », etc.`;
  }

  filteredData.forEach(({ name, time, ingredients, description }) => {
    recipesNotFound.innerHTML = ``;
    const card = document.createElement('div');

    card.innerHTML = `
    <div class="card">
        <div class="card-fake-img" alt=""></div>
        <div class="card-body">
          <div class="card-text">
            <h5 class="card-title card-name">${name}</h5>
            <div class="card-time card-title">
              <i class="fa-regular fa-clock"></i>
              <h5 class="card-time-number">${time} min</h5>
            </div>
          </div>
          <div class="card-ingredients-description">
            <div class="card-ingredients">
              <div class="ingredients">
                <ul>${ingredients
                  .map(({ ingredient, unit, quantity }) => {
                    return `<li><b>${ingredient}:</b> ${ingredient ? quantity : ''} ${
                      unit ? (unit === 'grammes' ? 'g' : unit) : ''
                    }</li>`;
                  })
                  .join('')}</ul>
              </div>
              <p class="card-text card-text-description">${description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
    results.appendChild(card);
  });
  const numberOfResults = document.querySelector('.number-of-results');
  numberOfResults.innerHTML = `${filteredData.length} recipes available`;
};

// KEEP
const createIngredientsDOM = list => {
  if (!list) {
    ingredientsListUL.innerHTML = '';
    searchBarIngredients.style.borderRadius = '5px';
  } else {
    searchBarIngredients.style.borderRadius = '5px 5px 0 0';
    ingredientsListUL.innerHTML = `${list
      .map(i => {
        return `<li class="ingredients-item">${i}</li>`;
      })
      .join('')}
      `;
  }

  createIngredientsTags();
};

// const createIngredientIndex = (filteredData, recipes) => {
//   const ingredientsTags = document.querySelector('.ingredients-tags');
//   let recipeSearch = [];

//   const handleIngredientClick = e => {
//     let newTerm = e.target.textContent;
//     let newFilteredData = filteredData.filter(({ ingredients }) => {
//       return ingredients.some(i => i.ingredient.includes(newTerm));
//     });

//     filteredData = [...newFilteredData];

//     let ingredientsList = [];
//     let ingredientsSET;
//     newFilteredData.map(({ ingredients }) => {
//       ingredients.map(({ ingredient }) => ingredientsList.push(ingredient));
//       ingredientsSET = [...new Set(ingredientsList)];
//     });
//     console.log('ingredientsList', ingredientsList);
//     const newIngredientsEl = document.querySelectorAll('.ingredient-tag');
//     const textContentArray = Array.from(newIngredientsEl).map(i => i.textContent);

//     if (!recipeSearch.includes(newTerm) && !textContentArray.includes(newTerm)) {
//       recipeSearch.push(newTerm);
//       const newIngredient = document.createElement('span');
//       newIngredient.classList.add('ingredient-tag');
//       newIngredient.innerHTML = `<p class="tag">${newTerm}</p><i class="close-index fa-regular fa-circle-xmark"></i>`;
//       ingredientsTags.appendChild(newIngredient);
//     }

//     createIngredientsDOM(ingredientsSET);
//     createCardsDOM(newFilteredData);

//     const indexIngredientEL = document.querySelectorAll('.close-index');
//     indexIngredientEL.forEach(el => {
//       el.addEventListener('click', () => {
//         const removedIngredient = el.parentElement.textContent;
//         el.parentElement.remove();

//         let newrecipeSearchArray = recipeSearch.filter(i => {
//           return !i.includes(removedIngredient);
//         });

//         recipeSearch = [...newrecipeSearchArray];

//         const filteredRecipesIngredients = recipes.filter(({ ingredients }) => {
//           const ingredientsArray = ingredients.map(i => i.ingredient);
//           return newrecipeSearchArray.every(searchValue =>
//             ingredientsArray.some(ingredient => ingredient.includes(searchValue)),
//           );
//         });
//         console.log('newrecipeSearchArray', filteredRecipesIngredients);

//         createIngredientsDOM(filterIngredientsForList(filteredRecipesIngredients));
//         createCardsDOM(filteredRecipesIngredients);
//       });
//     });
//   };

//   ingredientsListUL.addEventListener('click', handleIngredientClick);
//   // ingredientsListUL.addEventListener('click', e => {
//   //   if (e.target.matches('.ingredients-item')) {
//   //     handleIngredientClick(e);
//   //   }
//   // });
// };
