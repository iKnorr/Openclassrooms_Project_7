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

  // Alternative with for loop
  let filteredWithFor = [];

  for (i = 0; i < data.length; i++) {
    if (
      data[i].name.includes(searchTerm) ||
      data[i].description.includes(searchTerm) ||
      data[i].ingredients.some(i => i.ingredient.includes(searchTerm)) ||
      data[i].appliance.toLowerCase().includes(searchTerm) ||
      data[i].description.toLowerCase().includes(searchTerm)
    ) {
      filteredWithFor = [...filteredWithFor, data[i]];
    }
  }
  console.log('FILTERED ALL', filteredWithFor);
  return filteredWithFor;
};

// CREATE TAGS FOR INGREDIENTS
const createTypeTags = ({ type }) => {
  const typetags = document.querySelector(`.${type}-tags`);
  const typeItems = document.querySelectorAll(`.${type}-item`);
  const btnType = document.querySelector(`.btn-${type}`);
  const typeSearch = document.querySelector(`.${type}-search`);
  const typeSearchBar = document.querySelector(`.search-bar-${type}`);

  const createTypeDomAndDeleteTag = () => {
    createTypesDOM({
      typeSet: createIngredientsSet(recipeSearch.filteredRecipes),
      searchBar: searchBarIngredients,
      listUl: ingredientsListUL,
      type: 'ingredients',
    });
    createTypesDOM({
      typeSet: createApplianceSet(recipeSearch.filteredRecipes),
      searchBar: searchBarAppliance,
      listUl: applianceListUL,
      type: 'appliance',
    });
    createTypesDOM({
      typeSet: createUtensilsSet(recipeSearch.filteredRecipes),
      searchBar: searchBarUtensils,
      listUl: utensilsListUL,
      type: 'utensils',
    });

    if (type === 'ingredients') {
      deleteTag('ingredients');
    } else if (type === 'appliance') {
      deleteTag('appliance');
    } else if (type === 'utensils') {
      deleteTag('utensils');
    }
  };

  typeItems.forEach(i => {
    i.addEventListener('click', e => {
      const tag = i.textContent.toLowerCase();
      if (!recipeSearch[`${type}Tags`].includes(tag)) {
        recipeSearch[`${type}Tags`].push(tag);

        const tagElement = document.createElement('span');
        tagElement.classList.add(`${type}-tag`);
        tagElement.innerHTML = `<p class="tag">${tag}</p><i class="close-tag fa-regular fa-circle-xmark"></i>`;
        typetags.appendChild(tagElement);
        tagElement.classList.add(`tag-wrapper`);

        if (!recipeSearch[`${type}SearchValue`].trim() && !recipeSearch.filteredRecipes.length) {
          recipeSearch.filteredRecipes = filterRecipesByTags(baseRecipes, type);
          createTypeDomAndDeleteTag();
        } else if (!recipeSearch[`${type}SearchValue`].trim()) {
          recipeSearch.filteredRecipes = filterRecipesByTags(recipeSearch.filteredRecipes, type);
          createTypeDomAndDeleteTag();
        } else {
          recipeSearch.filteredRecipes = filterRecipesByTags(recipeSearch.filteredRecipes, type);
          createTypeDomAndDeleteTag();

          recipeSearch[`${type}SearchValue`] = '';
          typeSearchBar.value = '';
          typeSearch.style.display = 'none';
          btnType.style.display = 'block';
        }
        createCardsDOM(recipeSearch.filteredRecipes);
      }
      console.log('CREATE TAGS OBJECT', recipeSearch);
    });
  });
};

const deleteTag = type => {
  const closeTags = document.querySelectorAll('.close-tag');

  closeTags.forEach(i => {
    i.addEventListener('click', e => {
      console.log('DELETE', recipeSearch.filteredRecipes);
      const closeTag = e.target.previousElementSibling.textContent;
      recipeSearch[`${type}Tags`] = recipeSearch[`${type}Tags`].filter(i => {
        return i !== closeTag;
      });
      i.parentElement.remove();

      if (!recipeSearch[`${type}SearchValue`].trim()) {
        console.log('NO SEARCH VALUE DELETE', recipeSearch.filteredRecipes);
        recipeSearch.filteredRecipes = filterRecipesByTags(baseRecipes, type);
        console.log('AFTER: NO SEARCH VALUE DELETE', recipeSearch.filteredRecipes);

        createTypesDOM({
          typeSet: createIngredientsSet(recipeSearch.filteredRecipes),
          searchBar: searchBarIngredients,
          listUl: ingredientsListUL,
          type: 'ingredients',
        });
        createTypesDOM({
          typeSet: createApplianceSet(recipeSearch.filteredRecipes),
          searchBar: searchBarAppliance,
          listUl: applianceListUL,
          type: 'appliance',
        });
        createTypesDOM({
          typeSet: createUtensilsSet(recipeSearch.filteredRecipes),
          searchBar: searchBarUtensils,
          listUl: utensilsListUL,
          type: 'utensils',
        });
        // if (type === 'ingredients') {
        // } else if (type === 'appliance') {
        // } else if (type === 'utensils') {
        // }

        createCardsDOM(recipeSearch.filteredRecipes);
      } else {
        recipeSearch.filteredRecipes = filterRecipesByTags(baseRecipes, type);
        if (type === 'ingredients') {
          createTypesDOM({
            typeSet: recipeSearch.ingredientsSET,
            searchBar: searchBarIngredients,
            listUl: ingredientsListUL,
            type: 'ingredients',
          });
        } else if (type === 'appliance') {
          createTypesDOM({
            typeSet: recipeSearch.applianceSET,
            searchBar: searchBarAppliance,
            listUl: applianceListUL,
            type: 'appliance',
          });
        } else if (type === 'utensils') {
          createTypesDOM({
            typeSet: recipeSearch.createUtensilsSet,
            searchBar: searchBarUtensils,
            listUl: utensilsListUL,
            type: 'utensils',
          });
        }
      }
      createCardsDOM(recipeSearch.filteredRecipes);
      console.log('DELETE TAG SEARCH OBJECT', recipeSearch);
    });
  });
};

const filterRecipesByTags = (recipes, type) => {
  return recipes.filter(recipe => {
    if (type === 'ingredients') {
      const ingredients = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
      return recipeSearch.ingredientsTags.every(tag => ingredients.includes(tag));
    } else if (type === 'appliance') {
      const appliance = recipe.appliance.toLowerCase();
      return recipeSearch.applianceTags.every(tag => appliance.includes(tag));
    } else if (type === 'utensils') {
      const utensils = recipe.utensils.map(utensil => utensil.toLowerCase());
      return recipeSearch.utensilsTags.every(tag => utensils.includes(tag));
    }
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
const createTypesDOM = ({ typeSet, searchBar, listUl, type }) => {
  if (!typeSet) {
    searchBar.style.borderRadius = '5px';
  } else {
    searchBar.style.borderRadius = '5px 5px 0 0';
    listUl.innerHTML = `${typeSet
      .map(i => {
        return `<li class="list-item ${type}-item">${i}</li>`;
      })
      .join('')}`;
  }
  createTypeTags({ type: type });
};
