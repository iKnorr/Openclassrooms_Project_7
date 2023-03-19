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
  });

  // const showInputValue = () => {
  //   inputValue.innerHTML = `${searchTerm}`;
  // };

  const showList = () => {
    results.innerHTML = '';
    const filteredResults = recipes.filter(item => {
      return (
        item.name.toLowerCase().includes(searchTerm) ||
        item.ingredients.some(i => i.ingredient.toLowerCase().includes(searchTerm)) ||
        item.description.toLowerCase().includes(searchTerm)
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

  showList();
});
