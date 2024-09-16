import View from './view';
import icons from 'url:../../img/icons.svg';
import fracty from 'fracty';
/**
 * Class representing the view for a single recipe.
 * Extends from the base View class.
 */
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMsg = 'Recipe could not be found. Try another one!';
  _message = '';

  /**
   * Adds event listeners for rendering the recipe view on hashchange and load.
   *
   * @param {Function} handler - The function to call when the event is triggered.
   */
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  /**
   * Adds event listeners to handle updates to the number of servings.
   *
   * @param {Function} handler - The function to call when the servings need to be updated.
   */
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  /**
   * Adds event listener to handle bookmark actions.
   *
   * @param {Function} handler - The function to call when the bookmark button is clicked.
   */
  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  /**
   * Adds event listener to handle adding ingredients to the shopping list.
   *
   * @param {Function} handler - The function to call when an ingredient needs to be added to the shopping list.
   */
  addHandleraddShopItem(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn_to_list');
      if (!btn) return;
      const ingr = e.target.closest('.recipe__ingredient');
      const ingredient = Array.from(ingr.children)
        .filter(child => child !== e.target)
        .map(child => child.textContent)
        .slice(-2)
        .flat()
        .map(item => item.replace(/\n/g, ' ').trim());
      const [quantity, rest] = ingredient;
      const [unit, ...descriptionArray] = rest.split(/\s+/);
      const description = descriptionArray.join(' ');
      const shopItem = [quantity, unit, description].join(' ');
      handler(shopItem);
    });
  }

  /**
   * Adds an event listener for the delete recipe button.
   *
   * @param {Function} handler - The callback function to be executed when the delete button is clicked.
   *
   * @description
   * This method listens for click events on the parent element and checks if the clicked element
   * is a delete button. If so, it calls the provided handler function.
   */
  addHandlerDeleteRecipe(handler) {
    // Add a click event listener to the parent element
    this._parentElement.addEventListener('click', e => {
      // Find the closest delete button within the clicked target
      const btn = e.target.closest('.user_delete');

      // If no delete button is found, exit the function
      if (!btn) return;

      // Log click event (for debugging purposes)
      console.log('click');

      // Call the handler function
      handler();
    });
  }

  /**
   * Generates the HTML markup for the recipe view.
   *
   * @returns {string} - The HTML markup for the recipe view.
   */
  _generateMarkup() {
    return `<figure class="recipe__fig">
              <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
              <h1 class="recipe__title">
                <span>${this._data.title}</span>
              </h1>
            </figure>
    
            <div class="recipe__details">
              <div class="recipe__info">
                <svg class="recipe__info-icon">
                  <use href="${icons}#icon-clock"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${
                  this._data.cookingTime
                }</span>
                <span class="recipe__info-text">minutes</span>
              </div>
              <div class="recipe__info">
                <svg class="recipe__info-icon">
                  <use href="${icons}#icon-users"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${
                  this._data.servings
                }</span>
                <span class="recipe__info-text">servings</span>
                
                <div class="recipe__info-buttons"> 
                  <button class="btn--tiny btn--update-servings" data-update-to="${
                    this._data.servings - 1
                  }">
                    <svg>
                      <use href="${icons}#icon-minus-circle"></use>
                    </svg>
                  </button>
                  <button class="btn--tiny btn--update-servings" data-update-to="${
                    this._data.servings + 1
                  }">
                    <svg>
                      <use href="${icons}#icon-plus-circle"></use>
                    </svg>
                  </button>
                </div>
              </div>

               <div title="Total Recipe Calories" class="recipe__info">
                  <span class="recipe__info-text">
                     <div class="flame"></div>
                     </span>
                   <button class="btn--tiny btn--nutri">
                      <svg class="recipe__info-icon">
                        <use href="${icons}#icon-search"></use>
                       </svg>
                    </button>
    
                  <div class="nutri-list hidden">
                   <div class="resultKcalPercent">
                    <div class="resultKcal"> </div> 
                       <div class="carb"> </div>
                       <div class="fat">  </div>
                        <div class="protein"> </div>
                    </div>
    
                       <div title='close' class="closeNutri">  
                       <div>c</div>
                       <div>l</div>
                       <div>o</div>
                       <div>s</div>
                       <div>e</div> </div>
                  </div>
    
              </div>
    
     <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>

            <div class="user_delete ${
              this._data.key ? '' : 'hidden'
            }" title="Delete Recipe"> </div>


            </div>
            <button class="btn--round btn--bookmark">
              <svg class="">
                <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
              </svg>
            </button>
          </div>

          
        
            <div class="recipe__ingredients">
              <h2 class="heading--2">Recipe ingredients</h2>
              <ul class="recipe__ingredient-list">
               
               ${this._data.ingredients
                 .map(this._generateMarkupIngredient)
                 .join('')} 
            </div>
    
            <div class="recipe__directions">
              <h2 class="heading--2">How to cook it</h2>
              <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__publisher">${
                  this._data.publisher
                }</span>. Please check out
                directions at their website.
              </p>
              <a
                class="btn--small recipe__btn"
                href="${this._data.sourceUrl}"
                target="_blank"
              >
                <span>Directions</span>
                <svg class="search__icon">
                  <use href="${icons}#icon-arrow-right"></use>
                </svg>
              </a>
            </div> `;
  }

  _generateMarkupIngredient(ing) {
    return `<li class="recipe__ingredient">
            <div title="Add To Shop List" >
             <svg class="recipe__icon btn_to_list">
              <use  href="${icons}#icon-plus-circle"> 
              </svg></use>
          </div>
         <div class="recipe__quantity">${
           ing.quantity ? fracty(ing.quantity).toString() : ''
         }</div>
         <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
         ${ing.description}
          </div> 
       </li> `;
  }
}

export default new RecipeView();
