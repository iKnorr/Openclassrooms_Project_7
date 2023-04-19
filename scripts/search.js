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
const searchBar = document.getElementById('search-bar-common');
const searchBarIngredients = document.getElementById('search-bar-ingredients');
const ingredientsSearch = document.querySelector('.ingredients-search');
const results = document.getElementById('results');

const inputValue = document.getElementById('input-value');
const inputWrapper = document.querySelector('.input-value-wrapper');
const closeIcon = document.querySelector('.fa-circle-xmark');
const recipesNotFound = document.querySelector('.recipe-not-found');
const ingredientsListUL = document.querySelector('.ingredients-list');

getData().then(recipes => {
  const baseRecipes = recipes;

  createCardsDOM(baseRecipes);
  createIngredientsDOM(filterOutAllIngredients(baseRecipes));

  // Ingredients Dropdown Menu
  const btnIngredients = document.querySelector('.btn-ingredients');
  const chevronUp = document.querySelector('.fa-chevron-up');
  btnIngredients.addEventListener('click', () => {
    ingredientsSearch.style.display = 'block';
    btnIngredients.style.display = 'none';
  });

  chevronUp.addEventListener('click', () => {
    ingredientsSearch.style.display = 'none';
    btnIngredients.style.display = 'block';
  });

  // Global Search in names, description and ingredients
  searchBar.addEventListener('input', e => {
    recipeSearch.mainSearchValue = e.target.value.toLowerCase();
    recipeSearch.filteredRecipes = filterAll(recipeSearch.mainSearchValue);

    let filteredIngredientsList = [];
    recipeSearch.filteredRecipes.map(({ ingredients }) => {
      ingredients.map(({ ingredient }) => {
        filteredIngredientsList.push(ingredient.toLowerCase());
      });
    });
    // Creating SET to filter out doubles
    recipeSearch.ingredientsSET = [...new Set(filteredIngredientsList)];

    if (recipeSearch.mainSearchValue.length >= 3 || !recipeSearch.mainSearchValue.length) {
      createIngredientsDOM(recipeSearch.ingredientsSET);
      createCardsDOM(recipeSearch.filteredRecipes);
    }
    if (recipeSearch.mainSearchValue.length >= 3) {
      createIngredientsDOM(recipeSearch.ingredientsSET);
      createCardsDOM(recipeSearch.filteredRecipes);
    } else if (!recipeSearch.mainSearchValue.length) {
      createIngredientsDOM(filterOutAllIngredients(baseRecipes));
      createCardsDOM(baseRecipes);
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
    // Creating SET to filter out doubles
    recipeSearch.ingredientsSET = [...new Set(filteredIngredientsList)];

    if (recipeSearch.ingredientsSearchValue.length >= 3) {
      createIngredientsDOM(recipeSearch.ingredientsSET);
    } else if (!recipeSearch.ingredientsSearchValue.length) {
      recipeSearch.filteredRecipes = baseRecipes;
      createIngredientsDOM(filterOutAllIngredients(baseRecipes));
    }
    console.log('INGREDIENTS SEARCH OBJECT', recipeSearch);
  });
});
