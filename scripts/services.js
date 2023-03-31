const filterAll = (data, term) => {
  const results = data.filter(({ name, ingredients, description }) => {
    return (
      name.toLowerCase().includes(term) ||
      ingredients.some(i => i.ingredient.toLowerCase().includes(term)) ||
      description.toLowerCase().includes(term)
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
  data.map(({ ingredients }) => {
    return ingredients.map(({ ingredient }) => ingredientsList.push(ingredient.toLowerCase()));
  });
  return ingredientsList;
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

const createIngredientIndex = filteredData => {
  const ingredientsItems = document.querySelectorAll('.ingredients-item');
  ingredientsItems.forEach(i => {
    i.addEventListener('click', e => {
      let newTerm = e.target.textContent.toLowerCase();
      const newFiltered = filterIngredients(filteredData, newTerm);
      const newIngredientsOnly = filterOnlyIngredients(newFiltered);

      const newIngredient = document.createElement('span');
      newIngredient.classList.add('new-ingredient');
      newIngredient.innerHTML = `<p>${newTerm}</p><i class="fa-regular fa-circle-xmark"></i>`;
      indexIngredients.appendChild(newIngredient);
      console.log(newTerm, newIngredientsOnly, newFiltered);

      createIngredientsDOM(newIngredientsOnly);
      createCardsDOM(newFiltered);
      newIngredientsOnly.forEach(i => {
        i.addEventListener('click', function???);
      });
    });
  });
};
