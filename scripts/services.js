const filterAll = (data, searchTerm) => {
  const results = data.filter(({ name, ingredients, description }) => {
    return (
      name.toLowerCase().includes(searchTerm) ||
      ingredients.some(i => i.ingredient.toLowerCase().includes(searchTerm)) ||
      description.toLowerCase().includes(searchTerm)
    );
  });
  return results;
};

const filterIngredients = (data, term) => {
  const results = data.filter(({ ingredients }) => {
    return ingredients.some(i => i.ingredient.toLowerCase().includes(term));
  });
  return results;
};

const filterOnlyIngredients = data => {
  let ingredientsList = [];
  let ingredientsSET;
  data.map(({ ingredients }) => {
    ingredients.map(({ ingredient }) => ingredientsList.push(ingredient.toLowerCase()));
    ingredientsSET = [...new Set(ingredientsList)];
  });
  return ingredientsSET;
};

const createCardsDOM = filteredData => {
  const results = document.getElementById('results');
  results.innerHTML = '';

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

const createIngredientsDOM = list => {
  ingredientsListUL.innerHTML = `${list
    .map(i => {
      return `<li class="ingredients-item">${i}</li>`;
    })
    .join('')}
    `;
};

const createIngredientIndex = (filteredData, recipes) => {
  const indexIngredients = document.querySelector('.index-ingredients');
  let searchValues = [];

  const handleIngredientClick = e => {
    let newTerm = e.target.textContent.toLowerCase();
    let newFilteredData = filteredData.filter(({ ingredients }) => {
      return ingredients.some(i => i.ingredient.toLowerCase().includes(newTerm));
    });

    filteredData = [...newFilteredData];

    let ingredientsList = [];
    let ingredientsSET;
    newFilteredData.map(({ ingredients }) => {
      ingredients.map(({ ingredient }) => ingredientsList.push(ingredient.toLowerCase()));
      ingredientsSET = [...new Set(ingredientsList)];
    });
    console.log('ingredientsList', ingredientsList);
    const newIngredientsEl = document.querySelectorAll('.new-ingredient');
    const textContentArray = Array.from(newIngredientsEl).map(i => i.textContent);

    if (!searchValues.includes(newTerm) && !textContentArray.includes(newTerm)) {
      searchValues.push(newTerm);
      const newIngredient = document.createElement('span');
      newIngredient.classList.add('new-ingredient');
      newIngredient.innerHTML = `<p class="tag">${newTerm}</p><i class="close-index fa-regular fa-circle-xmark"></i>`;
      indexIngredients.appendChild(newIngredient);
    }

    createIngredientsDOM(ingredientsSET);
    createCardsDOM(newFilteredData);

    const indexIngredientEL = document.querySelectorAll('.close-index');
    indexIngredientEL.forEach(el => {
      el.addEventListener('click', () => {
        const removedIngredient = el.parentElement.textContent;
        el.parentElement.remove();

        let newSearchValuesArray = searchValues.filter(i => {
          return !i.includes(removedIngredient);
        });

        searchValues = [...newSearchValuesArray];

        const filteredRecipesByIngredients = recipes.filter(({ ingredients }) => {
          const ingredientsArray = ingredients.map(i => i.ingredient.toLowerCase());
          return newSearchValuesArray.every(searchValue =>
            ingredientsArray.some(ingredient => ingredient.includes(searchValue.toLowerCase())),
          );
        });
        console.log('newSearchValuesArray', newSearchValuesArray);

        createIngredientsDOM(filterOnlyIngredients(filteredRecipesByIngredients));
        createCardsDOM(filteredRecipesByIngredients);
      });
    });
  };

  ingredientsListUL.addEventListener('click', handleIngredientClick);
};
