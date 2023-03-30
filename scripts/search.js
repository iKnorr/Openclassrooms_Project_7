// Alternative with for loop
// let filteredWithFor = [];

// for (i = 0; i < recipes.length; i++) {
//   if (
//     recipes[i].name.toLowerCase().includes('huile') ||
//     recipes[i].description.toLowerCase().includes('huile') ||
//     recipes[i].ingredients.some(i => i.ingredient.toLowerCase().includes('huile'))
//   ) {
//     filteredWithFor = [...filteredWithFor, recipes[i]];
//   }
// }
// console.log('FOR LOOP', filteredWithFor);

// const showInputValue = () => {
//   inputValue.innerHTML = `${searchTerm}`;
// };
const searchBar = document.getElementById('search-bar-common');
const results = document.getElementById('results');
const inputValue = document.getElementById('input-value');
const inputWrapper = document.querySelector('.input-value-wrapper');
const closeIcon = document.querySelector('.fa-circle-xmark');
const recipesNotFound = document.querySelector('.recipe-not-found');
const ingredientsSearch = document.querySelector('.ingredients-search');
const ingredientsListUL = document.querySelector('.ingredients-list');
const indexIngredients = document.querySelector('.index-ingredients');

let recipes;

getData().then(recipes => {
  let searchTerm = '';
  let searchTermIngredients = '';
  // closeIcon.addEventListener('click', () => {
  //   console.log(searchBar.value);
  //   searchTerm = '';
  //   searchBar.value = ``;
  //   inputValue.innerHTML = ``;
  //   inputWrapper.classList.remove('active');
  //   showList();
  // });

  searchBar.addEventListener('input', e => {
    searchTerm = e.target.value.toLowerCase();
    if (searchTerm.length >= 3) {
      showList();
    } else if (searchTerm.length === 0) {
      showList();
    }
  });

  ingredientsSearch.addEventListener('input', e => {
    searchTermIngredients = e.target.value.toLowerCase();
    if (searchTermIngredients.length >= 3) {
      showList();
    } else if (searchTermIngredients.length === 0) {
      showList();
    }
  });

  const btnIngredients = document.querySelector('.btn-ingredients');
  const chevronUp = document.querySelector('.fa-chevron-up');

  btnIngredients.addEventListener('click', () => {
    ingredientsSearch.style.display = 'block';
    btnIngredients.style.display = 'none';
  });

  chevronUp.addEventListener('click', e => {
    ingredientsSearch.style.display = 'none';
    btnIngredients.style.display = 'block';
  });

  const showList = () => {
    results.innerHTML = '';
    const filteredResults = filterAll(recipes, searchTerm);

    if (!!filteredResults && searchTerm.length >= 3) {
      recipesNotFound.innerHTML = `Aucune recette ne correspond à votre critère &#9785;. Vous pouvez
    chercher « coco », « poisson », etc.`;
    }

    createCardsDOM(filteredResults);

    const ingredientsOnly = filterOnlyIngredients(filteredResults);

    let formerSET;
    const ingredientsSET = [...new Set(ingredientsOnly)];
    formerSET = ingredientsSET;

    const filteredIngredients = formerSET.filter(i => i.toLowerCase().includes(searchTermIngredients));

    if (ingredientsSearch.textContent.length >= 3) {
      createIngredientsDOM(filteredIngredients);
    } else {
      createIngredientsDOM(ingredientsSET);
    }
    createIngredientIndex(filteredResults);
  };

  showList();
});
