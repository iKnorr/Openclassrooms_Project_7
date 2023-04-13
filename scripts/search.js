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

// const recipeSearch = {
//   commonSearch: '',
//   filteredRecipes: [],
//   ingredientsSearch: '',
//   ingredientsSET: [],
//   ingredientsTags: [],
//   applianceSearch: '',
//   utensilsSearch: '',
//   utensilsTags: [],
// };

getData().then(recipes => {
  const baseRecipes = recipes;

  createCardsDOM(baseRecipes);
  createIngredientsDOM(filterIngredientsForList(baseRecipes));

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
    recipeSearch.commonSearch = e.target.value;
    recipeSearch.filteredRecipes = filterAll(baseRecipes, recipeSearch.commonSearch);

    if (recipeSearch.commonSearch.length >= 3 || !recipeSearch.commonSearch.length) {
      createIngredientsDOM(filterIngredientsForList(recipeSearch.filteredRecipes));
      createCardsDOM(recipeSearch.filteredRecipes);
    }
    console.log('SEARCH OBJECT', recipeSearch);
  });

  // Search in ingredients only
  searchBarIngredients.addEventListener('input', e => {
    recipeSearch.ingredientsSearch = e.target.value;

    recipeSearch.filteredRecipes = filterAll(
      recipeSearch.filteredRecipes.length ? recipeSearch.filteredRecipes : baseRecipes,
      recipeSearch.ingredientsSearch,
    );

    let filteredIngredientsList = [];
    recipeSearch.filteredRecipes.map(({ ingredients }) => {
      ingredients.map(({ ingredient }) => {
        if (ingredient.includes(recipeSearch.ingredientsSearch)) {
          filteredIngredientsList.push(ingredient);
        }
      });
    });

    // Creating SET to filter out doubles
    recipeSearch.ingredientsSET = [...new Set(filteredIngredientsList)];

    if (recipeSearch.ingredientsSearch.length >= 3 || !recipeSearch.ingredientsSearch.length) {
      createIngredientsDOM(recipeSearch.ingredientsSET);
    }
    createIngredientsTags();
    console.log('SEARCH OBJECT', recipeSearch);
  });
});

// const showContent = () => {

//   createCardsDOM(filterRecipes(baseRecipes, recipeSearch));
// };

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
// const searchBar = document.getElementById('search-bar-common');
// const results = document.getElementById('results');
// const inputValue = document.getElementById('input-value');
// const inputWrapper = document.querySelector('.input-value-wrapper');
// const closeIcon = document.querySelector('.fa-circle-xmark');
// const recipesNotFound = document.querySelector('.recipe-not-found');
// const ingredientsSearch = document.querySelector('.ingredients-search');
// const ingredientsListUL = document.querySelector('.ingredients-list');
// const ingredientsTags = document.querySelector('.ingredients-tags');

// let recipes;

// getData().then(recipes => {
//   // const baseRecipes = recipes;
//   let searchTerm = '';
//   let searchTermIngredients = '';
//   const searchTermArray = [];

//   searchBar.addEventListener('input', e => {
//     searchTerm = e.target.value;
//     if (!searchTermArray.includes(searchTerm)) {
//       searchTermArray.push(searchTerm);
//     }
//     if (searchTerm.length >= 3) {
//       showList();
//     } else if (searchTerm.length === 0) {
//       showList();
//     }
//   });

//   ingredientsSearch.addEventListener('input', e => {
//     searchTermIngredients = e.target.value;
//     if (searchTermIngredients.length >= 3) {
//       showList();
//     } else if (searchTermIngredients.length === 0) {
//       showList();
//     }
//   });

//   const btnIngredients = document.querySelector('.btn-ingredients');
//   const chevronUp = document.querySelector('.fa-chevron-up');

//   btnIngredients.addEventListener('click', () => {
//     ingredientsSearch.style.display = 'block';
//     btnIngredients.style.display = 'none';
//   });

//   chevronUp.addEventListener('click', e => {
//     ingredientsSearch.style.display = 'none';
//     btnIngredients.style.display = 'block';
//   });

//   const showList = () => {
//     results.innerHTML = '';

//     // const result = filterData(recipes, ['lait de coco', 'citron']);
//     // console.log('RESULT', result);
//     // const recipeSearch = ['coco', 'citron'];

//     // const filteredRecipesByIngredients = recipes.filter(({ ingredients }) => {
//     //   const ingredientsArray = ingredients.map(i => i.ingredient);

//     //   return recipeSearch.every(searchValue =>
//     //     ingredientsArray.some(ingredient => ingredient.includes(searchValue)),
//     //   );
//     // });

//     // console.log('RECIPES', filteredRecipesByIngredients);
//     const filteredResults = filterAll(recipes, searchTerm);

//     const filtered2 = filterAll2(recipes, ['coco']);
//     console.log('filtered2', filtered2);

//     if (!!filteredResults && searchTerm.length >= 3) {
//       recipesNotFound.innerHTML = `Aucune recette ne correspond à votre critère &#9785;. Vous pouvez
//     chercher « coco », « poisson », etc.`;
//     }

//     createCardsDOM(filteredResults);

//     const ingredientsOnly = filterOnlyIngredients(filteredResults);

//     let formerSET;
//     // const ingredientsSET = [...new Set(ingredientsOnly)];
//     formerSET = ingredientsOnly;

//     const filteredIngredients = formerSET.filter(i => i.includes(searchTermIngredients));

//     if (ingredientsSearch.textContent.length >= 3) {
//       createIngredientsDOM(filteredIngredients);
//     } else {
//       createIngredientsDOM(ingredientsOnly);
//     }
//     createIngredientIndex(filteredResults, recipes);
//   };

//   showList();
// });
