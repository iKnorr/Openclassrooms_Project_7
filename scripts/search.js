// SEARCH BARS
const searchBar = document.getElementById('search-bar-common');
const searchBarIngredients = document.querySelector('.search-bar-ingredients');
const searchBarAppliance = document.querySelector('.search-bar-appliance');
const searchBarUtensils = document.querySelector('.search-bar-utensils');
// Dropdown
const dropdownBtns = document.querySelectorAll('.btn-search');
const specificSearchBars = document.querySelectorAll('.specific-search-bar-wrapper');
const chevronsDown = document.querySelectorAll('.fa-chevron-down');
// Search values
const ingredientsSearchValue = document.querySelector('.ingredients-search');
const applianceSearchValue = document.querySelector('.appliance-search');
const utensilsSearchValue = document.querySelector('.utensils-search');

// const ingredientsSearch = document.querySelector('.ingredients-search');
const results = document.getElementById('results');
const recipesNotFound = document.querySelector('.recipe-not-found');
// Close tags
const closeIcon = document.querySelector('.fa-circle-xmark');
// Type lists
const ingredientsListUL = document.querySelector('.ingredients-list');
const applianceListUL = document.querySelector('.appliance-list');
const utensilsListUL = document.querySelector('.utensils-list');

getData().then(recipes => {
  const baseRecipes = recipes;
  const baseArray = !recipeSearch.filteredRecipes.length ? baseRecipes : recipeSearch.filteredRecipes;

  createCardsDOM(baseRecipes);
  createTypesDOM({
    typeSet: createIngredientsSet(baseRecipes),
    searchBar: searchBarIngredients,
    listUl: ingredientsListUL,
    type: 'ingredients',
  });
  createTypesDOM({
    typeSet: createApplianceSet(baseRecipes),
    searchBar: searchBarAppliance,
    listUl: applianceListUL,
    type: 'appliance',
  });
  createTypesDOM({
    typeSet: createUtensilsSet(baseRecipes),
    searchBar: searchBarUtensils,
    listUl: utensilsListUL,
    type: 'utensils',
  });

  // Common search
  searchBar.addEventListener('input', e => {
    const dataBaseArray = !recipeSearch.filteredRecipes.length ? baseRecipes : recipeSearch.filteredRecipes;

    recipeSearch.mainSearchValue = e.target.value.toLowerCase();
    recipeSearch.filteredRecipes = filterAll(recipeSearch.mainSearchValue, baseArray);

    createIngredientsSet(recipeSearch.filteredRecipes);
    createApplianceSet(recipeSearch.filteredRecipes);
    createUtensilsSet(recipeSearch.filteredRecipes);

    if (recipeSearch.mainSearchValue.length >= 3) {
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
    } else if (!recipeSearch.mainSearchValue.length) {
      createTypesDOM({
        typeSet: createIngredientsSet(baseRecipes),
        searchBar: searchBarIngredients,
        listUl: ingredientsListUL,
        type: 'ingredients',
      });
      createTypesDOM({
        typeSet: createApplianceSet(baseRecipes),
        searchBar: searchBarAppliance,
        listUl: applianceListUL,
        type: 'appliance',
      });
      createTypesDOM({
        typeSet: createUtensilsSet(baseRecipes),
        searchBar: searchBarUtensils,
        listUl: utensilsListUL,
        type: 'utensils',
      });
      createCardsDOM(baseRecipes);
      recipeSearch.filteredRecipes = baseRecipes;
    }
  });

  // Search in ingredients only
  searchBarIngredients.addEventListener('input', e => {
    const baseArray = !recipeSearch.filteredRecipes.length ? baseRecipes : recipeSearch.filteredRecipes;

    recipeSearch.ingredientsSearchValue = e.target.value.toLowerCase();

    recipeSearch.filteredRecipes = filterAll(recipeSearch.ingredientsSearchValue, baseArray);

    let filteredIngredientsList = [];
    recipeSearch.filteredRecipes.map(({ ingredients }) => {
      ingredients.map(({ ingredient }) => {
        if (ingredient.toLowerCase().includes(recipeSearch.ingredientsSearchValue)) {
          filteredIngredientsList.push(ingredient.toLowerCase());
        }
      });
    });
    recipeSearch.ingredientsSET = [...new Set(filteredIngredientsList)];

    if (recipeSearch.ingredientsSearchValue.length >= 3) {
      createTypesDOM({
        typeSet: recipeSearch.ingredientsSET,
        searchBar: searchBarIngredients,
        listUl: ingredientsListUL,
        type: 'ingredients',
      });
    } else if (!recipeSearch.ingredientsSearchValue.length) {
      recipeSearch.filteredRecipes = baseRecipes;
      createTypesDOM({
        typeSet: createIngredientsSet(baseRecipes),
        searchBar: searchBarIngredients,
        listUl: ingredientsListUL,
        type: 'ingredients',
      });
    }
  });
});

// Search in appliance only
searchBarAppliance.addEventListener('input', e => {
  const baseArray = !recipeSearch.filteredRecipes.length ? baseRecipes : recipeSearch.filteredRecipes;

  recipeSearch.applianceSearchValue = e.target.value.toLowerCase();

  recipeSearch.filteredRecipes = filterAll(recipeSearch.applianceSearchValue, baseArray);

  let applianceList = [];
  recipeSearch.filteredRecipes.map(({ appliance }) => {
    if (appliance.toLowerCase().includes(recipeSearch.applianceSearchValue)) {
      applianceList.push(appliance.toLowerCase());
    }
  });
  recipeSearch.applianceSET = [...new Set(applianceList)];

  if (recipeSearch.applianceSearchValue.length >= 3) {
    createTypesDOM({
      typeSet: recipeSearch.applianceSET,
      searchBar: searchBarAppliance,
      listUl: applianceListUL,
      type: 'appliance',
    });
  } else if (!recipeSearch.applianceSearchValue.length) {
    recipeSearch.filteredRecipes = baseRecipes;
    createTypesDOM({
      typeSet: createApplianceSet(baseRecipes),
      searchBar: searchBarAppliance,
      listUl: applianceListUL,
      type: 'appliance',
    });
  }
});

searchBarUtensils.addEventListener('input', e => {
  const baseArray = !recipeSearch.filteredRecipes.length ? baseRecipes : recipeSearch.filteredRecipes;

  recipeSearch.utensilsSearchValue = e.target.value.toLowerCase();

  recipeSearch.filteredRecipes = filterAll(recipeSearch.utensilsSearchValue, baseArray);

  let utensilsList = [];
  recipeSearch.filteredRecipes.map(({ utensils }) => {
    utensils.map(utensil => {
      if (utensil.toLowerCase().includes(recipeSearch.utensilsSearchValue)) {
        utensilsList.push(utensil.toLowerCase());
      }
    });
  });
  recipeSearch.utensilsSET = [...new Set(utensilsList)];

  if (recipeSearch.utensilsSearchValue.length >= 3) {
    createTypesDOM({
      typeSet: recipeSearch.utensilsSET,
      searchBar: searchBarUtensils,
      listUl: utensilsListUL,
      type: 'utensils',
    });
  } else if (!recipeSearch.utensilsSearchValue.length) {
    recipeSearch.filteredRecipes = baseRecipes;
    createTypesDOM({
      typeSet: createUtensilsSet(baseRecipes),
      searchBar: searchBarUtensils,
      listUl: utensilsListUL,
      type: 'utensils',
    });
  }
});
