import View from './view';
import icons from 'url:../../img/icons.svg';

/**
 * Class handles the UI and functionality for adding a new recipe.
 * It manages the modal window's visibility, ingredient input fields,
 * and the form submission process. The user can add multiple ingredients,
 * and the class ensures that the recipe is submitted with all required data.
 */

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnAddIngr = document.querySelector('.addIngr');
  _inputs = document.querySelector('.input_inline');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._addHandlerAddAndDeleteIngr();
  }

  /**
   * Toggles the visibility of the recipe addition modal window.
   */
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  /**
   * Adds event listeners to show the recipe modal window when the "Add Recipe" button is clicked.
   */
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  /**
   * Adds event listeners to hide the recipe modal window when the close button or overlay is clicked.
   */
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  /**
   * Adds a new ingredient input field to the recipe form.
   */
  newIngr() {
    const newI = `
     <div class="input_inline">
            <label class="shopList"> 📑 </label>
            <input class="divDescription"
              type="text"
              required
              name="ingr-description"
              placeholder="Description"
              autocomplete="off"
            />
            <input class="inputWidth" required type="number" name="ingr-quantity" step="0.25" placeholder="Quantity" autocomplete="off"  />
            <input list="units" class="inputWidth" name="ingr-unit" type="text" placeholder="Unit" autocomplete="off" />
              <datalist id="units">
                <option value="g"></option>
                <option value="kg"></option>
                <option value="ml"></option>
                <option value="l"></option>
                <option value="tsp"></option>
                <option value="tbsp"></option>
                <option value="cup"></option>
                <option value="oz"></option>
                <option value="lb"></option>
                <option value="pcs"></option>
              </datalist>
           <span class="deleteIngr">x</span>
            </div>`;
    this._inputs.insertAdjacentHTML('beforeend', newI);
  }

  /**
   * Adds event listeners for adding new ingredients and deleting existing ones.
   */
  _addHandlerAddAndDeleteIngr() {
    // Add Ingredients
    this._btnAddIngr.addEventListener('click', this.newIngr.bind(this));
    // Delete Ingredients
    this._parentElement.addEventListener('click', e => {
      e.preventDefault();
      const btn = e.target.closest('.deleteIngr');
      if (!btn) return;
      e.target.closest('.input_inline').remove();
    });
  }

  /**
   * Adds an event listener for the form submission and calls the provided handler function.
   *
   * @param {Function} handler - The function to call when the form is submitted.
   */
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)];
      // console.log(dataArray);
      handler(dataArray);
    });
  }

  /**
   * Generates the HTML markup for the view.
   *
   * This method should be overridden in subclasses to generate specific markup.
   */
  _generateMarkup() {}
}

export default new AddRecipeView();
