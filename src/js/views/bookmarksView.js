import icons from 'url:../../img/icons.svg';
import previewView from './previewView';
import View from './view';

/**
 * Class representing the view for bookmarks.
 * Extends from the base View class.
 */
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMsg = 'No bookmarks yet. Find a nice recipe and bookmark it.';
  _message = '';

  /**
   * Adds an event listener to render the bookmarks view when the page is loaded.
   *
   * @param {Function} handler - The function to call when the page is loaded.
   */
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  /**
   * Generates the HTML markup for the bookmarks view.
   *
   * @returns {string} - The HTML markup for the bookmarks.
   */
  _generateMarkup() {
    return this._data.map(bm => previewView.render(bm, false)).join('');
  }
}

export default new BookmarksView();
