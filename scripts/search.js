const searchBar = document.getElementById('search-bar');
const results = document.getElementById('results');
const inputValue = document.getElementById('input-value');
const inputWrapper = document.querySelector('.input-value-wrapper');
const closeIcon = document.querySelector('.fa-circle-xmark');
const recipesNotFound = document.querySelector('.recipe-not-found');
let searchTerm = '';

let recipes;

getData().then(recipes => {
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
    }
    showList();
  });

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

  const searchName = (name, searchTerm) => {
    name.toLowerCase().includes(searchTerm);
  };

  const searchIngredients = (ingredients, searchTerm) => {
    ingredients.some(i => i.ingredient.toLowerCase().includes(searchTerm));
  };

  const showList = () => {
    results.innerHTML = '';
    const filteredResults = recipes.filter(({ name, ingredients, description }) => {
      return (
        searchName(name, searchTerm) ||
        searchIngredients(ingredients, searchTerm) ||
        description.toLowerCase().includes(searchTerm)
      );
    });

    if (!!filteredResults && searchTerm.length >= 3) {
      recipesNotFound.innerHTML = `Aucune recette ne correspond à votre critère &#9785;. Vous pouvez
    chercher « coco », « poisson », etc.`;
    }

    filteredResults.forEach(item => {
      recipesNotFound.innerHTML = ``;
      const card = document.createElement('div');

      card.innerHTML = `
      <div class="card">
          <div class="card-fake-img" alt=""></div>
          <div class="card-body">
            <div class="card-text">
              <h5 class="card-title card-name">${item.name}</h5>
              <div class="card-time card-title">
                <i class="fa-regular fa-clock"></i>
                <h5 class="card-time-number">${item.time} min</h5>
              </div>
            </div>
            <div class="card-ingredients-description">
              <div class="card-ingredients">
                <div class="ingredients">
                  <ul>${item.ingredients
                    .map(i => {
                      return `<li><b>${i.ingredient}:</b> ${i.quantity ? i.quantity : ''} ${
                        i.unit ? (i.unit === 'grammes' ? 'g' : i.unit) : ''
                      }</li>`;
                    })
                    .join('')}</ul>
                </div>
                <p class="card-text card-text-description">${item.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
      results.appendChild(card);
    });
  };

  let ingredientsList = [];
  recipes.map(({ ingredients }) => {
    return ingredients.map(({ ingredient }) => ingredientsList.push(ingredient.toLowerCase()));
  });

  const ingredientsSET = new Set(ingredientsList);
  const newIngredientsList = [...ingredientsSET];

  const ingredientsSearch = document.querySelector('.ingredients-search');
  const ingredientsWrapper = document.createElement('div');
  let searchTermIngredients = '';

  ingredientsSearch.addEventListener('input', e => {
    searchTermIngredients = e.target.value.toLowerCase();
    if (searchTermIngredients.length >= 3) {
      showListIngredients();
      showList();
    }
    showListIngredients();
    showList();
  });

  const showListIngredients = () => {
    const filteredIngredients = newIngredientsList.filter(i => i.includes(searchTermIngredients));

    ingredientsWrapper.innerHTML = `

    <i class="fa-solid fa-chevron-up"></i>
    <ul class="ingredients-list">${filteredIngredients
      .map(i => {
        return `<li><a class="ingredients-item" href="#">${i}</a></li>`;
      })
      .join('')}
      </ul>
      `;
    ingredientsSearch.appendChild(ingredientsWrapper);
  };

  showListIngredients();
  showList();
});
