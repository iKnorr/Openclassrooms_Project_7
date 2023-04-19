let baseRecipes;

getData().then(recipes => {
  baseRecipes = recipes;
});

const recipeSearch = {
  mainSearchValue: '',
  filteredRecipes: [],
  ingredientsSearchValue: '',
  ingredientsSET: [],
  ingredientsTags: [],
  applianceSearchValue: '',
  applianceTags: [],
  applianceSET: [],
  utensilsSearchValue: '',
  utensilsTags: [],
  utensilsSET: [],
};

// FILTER NAME, INGREDIENTS, DESCRIPTION
const filterAll = searchTerm => {
  const data = !recipeSearch.filteredRecipes.length ? baseRecipes : recipeSearch.filteredRecipes;

  const results = data.filter(({ name, ingredients, description }) => {
    return (
      name.toLowerCase().includes(searchTerm) ||
      ingredients.some(i => i.ingredient.toLowerCase().includes(searchTerm)) ||
      description.toLowerCase().includes(searchTerm)
    );
  });
  return results;
};

// FILTER OUT ALL INGREDIENTS
const filterOutAllTypes = data => {
  let list = [];
  let set;
  data.map(({ ingredients }) => {
    ingredients.map(({ ingredient }) => list.push(ingredient.toLowerCase()));
    set = [...new Set(list)];
  });
  return set;
};
// OLD FOR JUST INGREDIENTS
// const filterOutAllTypes = data => {
//   let ingredientsList = [];
//   let ingredientsSET;
//   data.map(({ ingredients }) => {
//     ingredients.map(({ ingredient }) => ingredientsList.push(ingredient.toLowerCase()));
//     ingredientsSET = [...new Set(ingredientsList)];
//   });
//   return ingredientsSET;
// };

// CREATE TAGS FOR INGREDIENTS
const createIngredientsTags = () => {
  const ingredientsTags = document.querySelector('.ingredients-tags');
  const ingredientsItems = document.querySelectorAll('.ingredients-item');
  const btnIngredients = document.querySelector('.btn-ingredients');
  const ingredientsSearch = document.querySelector('.ingredients-search');

  // Adding eventlistener on ingredients list
  ingredientsItems.forEach(i => {
    i.addEventListener('click', e => {
      const tag = i.textContent.toLowerCase();
      if (!recipeSearch.ingredientsTags.includes(tag)) {
        recipeSearch.ingredientsTags.push(tag);

        // Creating ingredients tags
        const ingredientTag = document.createElement('span');
        ingredientTag.classList.add('ingredient-tag');
        ingredientTag.innerHTML = `<p class="tag">${tag}</p><i class="close-tag fa-regular fa-circle-xmark"></i>`;
        ingredientsTags.appendChild(ingredientTag);

        if (!recipeSearch.ingredientsSearchValue.trim()) {
          recipeSearch.filteredRecipes = filterRecipesByIngredientTags(baseRecipes);
          createIngredientsDOM(filterOutAllTypes(recipeSearch.filteredRecipes));
          createCardsDOM(recipeSearch.filteredRecipes);
          deleteTag();
        } else {
          recipeSearch.filteredRecipes = filterRecipesByIngredientTags(recipeSearch.filteredRecipes);
          recipeSearch.ingredientsSearchValue = '';
          searchBarIngredients.value = '';
          ingredientsSearch.style.display = 'none';
          btnIngredients.style.display = 'block';
          createIngredientsDOM(filterOutAllTypes(recipeSearch.filteredRecipes));
          createCardsDOM(recipeSearch.filteredRecipes);
          deleteTag();
        }
        console.log('TAGS SEARCH OBJECT', recipeSearch);
      }
    });
  });
};

const deleteTag = () => {
  const closeTags = document.querySelectorAll('.close-tag');

  closeTags.forEach(i => {
    i.addEventListener('click', e => {
      const closeTag = e.target.previousElementSibling.textContent;
      recipeSearch.ingredientsTags = recipeSearch.ingredientsTags.filter(i => {
        return i !== closeTag;
      });
      i.parentElement.remove();

      if (!recipeSearch.ingredientsSearchValue.trim()) {
        recipeSearch.filteredRecipes = filterRecipesByIngredientTags(baseRecipes);
        createIngredientsDOM(filterOutAllTypes(recipeSearch.filteredRecipes));
        createCardsDOM(recipeSearch.filteredRecipes);
      } else {
        recipeSearch.filteredRecipes = filterRecipesByIngredientTags(recipeSearch.filteredRecipes);
        createIngredientsDOM(recipeSearch.ingredientsSET);
        createCardsDOM(recipeSearch.filteredRecipes);
      }
      console.log('DELETE TAG SEARCH OBJECT', recipeSearch);
    });
  });
};

const filterRecipesByIngredientTags = recipes => {
  return recipes.filter(recipe => {
    const ingredients = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
    return recipeSearch.ingredientsTags.every(tag => ingredients.includes(tag));
  });
};

// CREATE DOM FOR CARDS
const createCardsDOM = filteredData => {
  const results = document.getElementById('results');
  results.innerHTML = '';

  if (!filteredData.length) {
    recipesNotFound.innerHTML = `Aucune recette ne correspond à votre critère &#9785;. Vous pouvez chercher « lait », « poulet », etc.`;
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
                    return `<li><b>${ingredient}:</b> ${ingredient ? (quantity ? quantity : '') : ''} ${
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

// CREATE DOM FOR INGREDIENTS
const createIngredientsDOM = list => {
  if (!list) {
    searchBarIngredients.style.borderRadius = '5px';
  } else {
    searchBarIngredients.style.borderRadius = '5px 5px 0 0';
    ingredientsListUL.innerHTML = `${list
      .map(i => {
        return `<li class="list-item ingredients-item">${i}</li>`;
      })
      .join('')}
      `;
  }

  createIngredientsTags();
};

const createAppliancesDOM = list => {
  if (!list) {
    searchBarIngredients.style.borderRadius = '5px';
  } else {
    searchBarAppliances.style.borderRadius = '5px 5px 0 0';
    appliancesListUL.innerHTML = `${list
      .map(i => {
        return `<li class="list-item appliances-item">${i}</li>`;
      })
      .join('')}
      `;
  }
};
