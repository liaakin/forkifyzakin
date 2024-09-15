import icons from 'url:../../img/icons.svg';
import View from './view';

/**
 * `ShoppingListView` manages the display and interaction with the shopping list.
 * It is responsible for rendering the list of items, deleting items from the list,
 * and handling events related to the shopping list.
 */
class ShoppingListView extends View {
  // The DOM element where the shopping list is displayed
  _parentElement = document.querySelector('.shop__list');
  _errorMsg = 'Nothing to buy yet'; // Message when the shopping list is empty
  _message = ''; // General message placeholder

  // Array to store the shopping list items
  shopItems = [];

  /**
   * Adds an event listener to the window's load event to trigger the provided
   * handler function when the page loads.
   * @param {Function} handler - The function to be called on page load.
   */
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  /**
   * Generates HTML markup for the shopping list items.
   * Each item is rendered with a delete button.
   * @returns {string} - The HTML markup for the shopping list items.
   */
  _generateMarkup() {
    return this.shopItems
      .map(
        (item, index) => ` <div class="shopItems">
        <li class="shopItem">
          ${item} <span class="deleteShopItem" data-index="${index}"> x </span>
        </li>
      </div> `
      )
      .join('');
  }

  /**
   * Renders a list of shopping items into the DOM.
   * Clears the existing list and inserts the new items.
   * @param {Array} items - An array of items to be rendered.
   */
  renderList(items) {
    this._parentElement.innerHTML = '';
    items.forEach((item, index) => {
      const markup = `<div class="shopItems"><li class="shopItem">
                       ${item} <span class="deleteShopItem" data-index=${index}> x </span>
                       </li></div>`;
      this._parentElement.insertAdjacentHTML('beforeend', markup);
    });
  }

  /**
   * Adds an event listener to handle the deletion of shopping list items.
   * The handler function is called with the index of the item to be deleted.
   * @param {Function} handler - The function to be called when an item is deleted.
   */
  deleteItem(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.deleteShopItem');
      if (!btn) return;
      const item = e.target.closest('.shopItem');
      if (item) {
        const index = parseInt(e.target.dataset.index, 10);
        handler(index);
      }
    });
  }
}

export default new ShoppingListView();
