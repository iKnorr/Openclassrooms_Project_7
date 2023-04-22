// Alternative with for loop
// let filteredWithFor = [];

// for (i = 0; i < recipes.length; i++) {
//   if (
//     recipes[i].name.includes('huile') ||
//     recipes[i].description.includes('huile') ||
//     recipes[i].ingredients.some(i => i.ingredient.includes('huile'))
//   ) {
//     filteredWithFor = [...filteredWithFor, recipes[i]];
//   }
// }
// console.log('FOR LOOP', filteredWithFor);

// const showInputValue = () => {
//   inputValue.innerHTML = `${searchTerm}`;
// };
const inputValue = document.getElementById('input-value');
const inputWrapper = document.querySelector('.input-value-wrapper');

// SEARCH BARS
const searchBar = document.getElementById('search-bar-common');
const searchBarIngredients = document.querySelector('.search-bar-ingredients');
const searchBarAppliances = document.querySelector('.search-bar-appliances');
const searchBarUtensils = document.querySelector('.search-bar-utensils');
// Dropdown
const dropdownBtns = document.querySelectorAll('.btn-search');
const specificSearchBars = document.querySelectorAll('.specific-search-bar-wrapper');
const chevronsDown = document.querySelectorAll('.fa-chevron-down');
// Search values
const ingredientsSearchValue = document.querySelector('.ingredients-search');
const appliancesSearchValue = document.querySelector('.appliances-search');
const utensilsSearchValue = document.querySelector('.utensils-search');

const ingredientsSearch = document.querySelector('.ingredients-search');
const results = document.getElementById('results');
const recipesNotFound = document.querySelector('.recipe-not-found');
// Close tags
const closeIcon = document.querySelector('.fa-circle-xmark');
// Type lists
const ingredientsListUL = document.querySelector('.ingredients-list');
const appliancesListUL = document.querySelector('.appliances-list');
const utensilsListUL = document.querySelector('.utensils-list');

const createIngredientsSet = data => {
  let filteredIngredientsList = [];
  data.map(({ ingredients }) => {
    ingredients.map(({ ingredient }) => filteredIngredientsList.push(ingredient.toLowerCase()));
  });
  recipeSearch.ingredientsSET = [...new Set(filteredIngredientsList)];
  return recipeSearch.ingredientsSET;
};
const createAppliancesSet = data => {
  let appliancesList = [];
  data.map(({ appliance }) => appliancesList.push(appliance.toLowerCase()));
  recipeSearch.applianceSET = [...new Set(appliancesList)];
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

getData().then(recipes => {
  const baseRecipes = recipes;

  createCardsDOM(baseRecipes);
  createTypesDOM({
    typeSet: createIngredientsSet(baseRecipes),
    searchBar: searchBarIngredients,
    listUl: ingredientsListUL,
    type: 'ingredients',
  });
  createTypesDOM({
    typeSet: createAppliancesSet(baseRecipes),
    searchBar: searchBarAppliances,
    listUl: appliancesListUL,
    type: 'appliances',
  });
  createAppliancesDOM(createAppliancesSet(baseRecipes));
  createUtensilsDOM(createUtensilsSet(baseRecipes));
  // createIngredientsDOM(createIngredientsSet(baseRecipes));

  // Dropdown menus
  dropdownBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      const target = e.target;
      if (target.classList.contains('fa-chevron-down')) {
        target.parentElement.style.display = 'none';
        target.parentElement.nextElementSibling.style.display = 'block';
      } else if (target.classList.contains('btn-search')) {
        target.nextElementSibling.style.display = 'block';
        target.style.display = 'none';
      }
    });
  });

  const chevronsUp = document.querySelectorAll('.fa-chevron-up');
  chevronsUp.forEach(chevron => {
    chevron.addEventListener('click', e => {
      e.target.parentElement.previousElementSibling.style.display = 'block';
      e.target.parentElement.style.display = 'none';
    });
  });

  // const createAppliances

  // Common search
  searchBar.addEventListener('input', e => {
    recipeSearch.mainSearchValue = e.target.value.toLowerCase();
    recipeSearch.filteredRecipes = filterAll(recipeSearch.mainSearchValue);

    createIngredientsSet(recipeSearch.filteredRecipes);
    createAppliancesSet(recipeSearch.filteredRecipes);
    createUtensilsSet(recipeSearch.filteredRecipes);

    if (recipeSearch.mainSearchValue.length >= 3) {
      // createIngredientsDOM(recipeSearch.ingredientsSET);
      createTypesDOM({
        typeSet: createIngredientsSet(recipeSearch.ingredientsSET),
        searchBar: searchBarIngredients,
        listUl: ingredientsListUL,
        type: 'ingredients',
      });

      createAppliancesDOM(recipeSearch.applianceSET);
      createCardsDOM(recipeSearch.filteredRecipes);
    } else if (!recipeSearch.mainSearchValue.length) {
      // createIngredientsDOM(createIngredientsSet(baseRecipes));
      createTypesDOM({
        typeSet: createIngredientsSet(baseRecipes),
        searchBar: searchBarIngredients,
        listUl: ingredientsListUL,
        type: 'ingredients',
      });
      createAppliancesDOM(createAppliancesSet(baseRecipes));
      createCardsDOM(baseRecipes);
      recipeSearch.filteredRecipes = baseRecipes;
    }
    console.log('MAIN SEARCH OBJECT', recipeSearch);
  });

  // Search in ingredients only
  searchBarIngredients.addEventListener('input', e => {
    recipeSearch.ingredientsSearchValue = e.target.value.toLowerCase();

    recipeSearch.filteredRecipes = filterAll(recipeSearch.ingredientsSearchValue);

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
      // createIngredientsDOM(recipeSearch.ingredientsSET);
      createTypesDOM({
        typeSet: recipeSearch.ingredientsSET,
        searchBar: searchBarIngredients,
        listUl: ingredientsListUL,
        type: 'ingredients',
      });
    } else if (!recipeSearch.ingredientsSearchValue.length) {
      recipeSearch.filteredRecipes = baseRecipes;
      // createIngredientsDOM(createIngredientsSet(baseRecipes));
      createTypesDOM({
        typeSet: createIngredientsSet(baseRecipes),
        searchBar: searchBarIngredients,
        listUl: ingredientsListUL,
        type: 'ingredients',
      });
    }
    console.log('INGREDIENTS SEARCH OBJECT', recipeSearch);
  });
});

// Search in appliances only
searchBarAppliances.addEventListener('input', e => {
  recipeSearch.applianceSearchValue = e.target.value.toLowerCase();

  recipeSearch.filteredRecipes = filterAll(recipeSearch.applianceSearchValue);

  let applianceList = [];
  recipeSearch.filteredRecipes.map(({ appliance }) => {
    if (appliance.toLowerCase().includes(recipeSearch.applianceSearchValue)) {
      applianceList.push(appliance.toLowerCase());
    }
  });
  recipeSearch.applianceSET = [...new Set(applianceList)];

  if (recipeSearch.applianceSearchValue.length >= 3) {
    createAppliancesDOM(recipeSearch.applianceSET);
  } else if (!recipeSearch.applianceSearchValue.length) {
    recipeSearch.filteredRecipes = baseRecipes;
    createAppliancesDOM(createAppliancesSet(baseRecipes));
  }
  console.log('APPLIANCES SEARCH OBJECT', recipeSearch);
});
