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

// Dropdown menus
const ingredientsBtn = document.querySelector('.btn-ingredients');
const ingredientsSearch = document.querySelector('.ingredients-search');
const ingredientsChevronUp = ingredientsSearch.querySelector('.fa-chevron-up');

const utensilsBtn = document.querySelector('.btn-utensils');
const utensilsSearch = document.querySelector('.utensils-search');
const utensilsChevronUp = utensilsSearch.querySelector('.fa-chevron-up');

const applianceBtn = document.querySelector('.btn-appliance');
const applianceSearch = document.querySelector('.appliance-search');
const applianceChevronUp = applianceSearch.querySelector('.fa-chevron-up');

ingredientsBtn.addEventListener('click', () => {
  toggleSearchBar({ button: ingredientsBtn, searchBar: ingredientsSearch });
  closeOtherDropdowns({
    button1: utensilsBtn,
    button2: applianceBtn,
    dropdown1: utensilsSearch,
    dropdown2: applianceSearch,
  });
});

utensilsBtn.addEventListener('click', () => {
  toggleSearchBar({ button: utensilsBtn, searchBar: utensilsSearch });
  closeOtherDropdowns({
    button1: applianceBtn,
    button2: ingredientsBtn,
    dropdown1: applianceSearch,
    dropdown2: ingredientsSearch,
  });
});

applianceBtn.addEventListener('click', () => {
  toggleSearchBar({ button: applianceBtn, searchBar: applianceSearch });
  closeOtherDropdowns({
    button1: ingredientsBtn,
    button2: utensilsBtn,
    dropdown1: ingredientsSearch,
    dropdown2: utensilsSearch,
  });
});

ingredientsChevronUp.addEventListener('click', function (e) {
  e.stopPropagation();
  closeDropdown(ingredientsBtn, ingredientsSearch);
});

applianceChevronUp.addEventListener('click', function (e) {
  e.stopPropagation();
  closeDropdown(applianceBtn, applianceSearch);
});

utensilsChevronUp.addEventListener('click', function (e) {
  e.stopPropagation();
  closeDropdown(utensilsBtn, utensilsSearch);
});

const toggleSearchBar = ({ button, searchBar }) => {
  if (!searchBar.classList.contains('show')) {
    button.classList.remove('show');
    searchBar.classList.add('show');
  } else {
    button.classList.add('show');
    searchBar.classList.remove('show');
  }
};

const closeOtherDropdowns = ({ button1, dropdown1, button2, dropdown2 }) => {
  if (dropdown1.classList.contains('show')) {
    button1.classList.add('show');
    dropdown1.classList.remove('show');
  }
  if (dropdown2.classList.contains('show')) {
    button2.classList.add('show');
    dropdown2.classList.remove('show');
  }
};

const closeDropdown = (button, searchBar) => {
  button.classList.add('show');
  searchBar.classList.remove('show');
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

// Create Sets
const createIngredientsSet = data => {
  let filteredIngredientsList = [];
  data.map(({ ingredients }) => {
    ingredients.map(({ ingredient }) => filteredIngredientsList.push(ingredient.toLowerCase()));
  });
  recipeSearch.ingredientsSET = [...new Set(filteredIngredientsList)];
  return recipeSearch.ingredientsSET;
};
const createApplianceSet = data => {
  let applianceList = [];
  data.map(({ appliance }) => applianceList.push(appliance.toLowerCase()));
  recipeSearch.applianceSET = [...new Set(applianceList)];
  return recipeSearch.applianceSET;
};
const createUtensilsSet = data => {
  let utensilsList = [];
  data.map(({ utensils }) => {
    utensils.map(utensil => {
      utensilsList.push(utensil.toLowerCase());
    });
  });
  recipeSearch.utensilsSET = [...new Set(utensilsList)];
  return recipeSearch.utensilsSET;
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
    deleteTag(type);
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
          console.log('ELSE');
          recipeSearch.filteredRecipes = filterRecipesByTags(recipeSearch.filteredRecipes, type);
          createTypeDomAndDeleteTag();

          recipeSearch[`${type}SearchValue`] = '';
          typeSearchBar.value = '';
          typeSearch.classList.remove('show');
          btnType.classList.add('show');
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
      const closeTag = e.target.previousElementSibling.textContent;
      recipeSearch[`${type}Tags`] = recipeSearch[`${type}Tags`].filter(i => {
        return i !== closeTag;
      });
      i.parentElement.remove();

      if (!recipeSearch[`${type}SearchValue`].trim()) {
        recipeSearch.filteredRecipes = filterRecipesByTags(baseRecipes, type);

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

const filterRecipesByTags = recipes => {
  return recipes.filter(recipe => {
    const ingredients = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
    const appliance = recipe.appliance.toLowerCase();
    const utensils = recipe.utensils.map(utensil => utensil.toLowerCase());

    const ingredientsMatch = recipeSearch.ingredientsTags.every(tag => ingredients.includes(tag));
    const applianceMatch = recipeSearch.applianceTags.every(tag => appliance.includes(tag));
    const utensilsMatch = recipeSearch.utensilsTags.every(tag => utensils.includes(tag));

    return ingredientsMatch && applianceMatch && utensilsMatch;
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
  numberOfResults.innerHTML = `${filteredData.length}
recettes disponibles`;
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
