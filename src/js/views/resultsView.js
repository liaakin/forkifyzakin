import icons from 'url:../../img/icons.svg';
import previewView from './previewView';
import View from './view';

/**
 * `ResultsView` is a specialized view class for displaying search results.
 * It extends the base class `View` and manages the display of recipe suggestions,
 * including functions for sorting and showing the number of recipes found.
 */
class ResultsView extends View {
  // The element where search results are displayed
  _parentElement = document.querySelector('.results');

  // Error message when no recipes are found
  _errorMsg = 'Recipe could not be found. Try another one!';

  // Message variable (not used)
  _message = '';

  /**
   * Shows the sort button by removing the `hidden` class.
   */
  sortBtn() {
    document.querySelector('.abc').textContent = 'sort A ➜ Z';
    document.querySelector('.abc').classList.remove('hidden');
  }

  /**
   * Initializes the event listener for sorting recipes.
   * The event listener responds to clicks on elements with the class `.abc`
   * and calls the `handler` function to sort the recipes.
   * @param {Function} handler - The function to be called when the sort button is clicked.
   */
  sortABC(handler) {
    document
      .querySelector('.search-results')
      .addEventListener('click', function (e) {
        const btn = e.target.closest('.abc');
        if (!btn) return;
        handler();
      });
  }

  /**
   * hiding the sort button after sorted
   */
  hideSortBtn() {
    document.querySelector('.abc').textContent = 'already sorted';
    setTimeout(() => {
      document.querySelector('.abc').classList.add('hidden');
    }, 1500);
  }

  /**
   * Updates the display of the number of recipes found and the search query.
   * @param {number} data - The number of recipes found.
   * @param {string} query - The search query.
   */
  recipeAmounts(data, query) {
    document.querySelector(
      '.resAmount'
    ).textContent = ` found ${data} recipes for '${query}' `;
  }

  /**
   * Generates the HTML markup for the search results.
   * For each recipe, the `previewView.render()` method is called
   * to create the markup for the recipe. The markups are then joined into a single
   * HTML string.
   * @returns {string} - The HTML string for the search results.
   */
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
