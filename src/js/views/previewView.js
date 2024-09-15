import View from './view';
import icons from 'url:../../img/icons.svg';

/**
 * Class representing the preview view of recipes.
 * Extends from the base View class.
 */
class PreviewView extends View {
  _parentElement = ''; // The parent element where the preview will be inserted

  /**
   * Generates the markup for a recipe preview.
   *
   * @returns {string} - The HTML markup for the recipe preview.
   */
  _generateMarkup() {
    const id = window.location.hash.slice(1); // Get the current recipe ID from the URL hash

    return `
      <li class="preview">
        <a class="preview__link ${
          this._data.id === id ? 'preview__link--active' : ''
        }" href="#${this._data.id}">
          <figure class="preview__fig">
            <img src="${this._data.image}" alt="${this._data.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${this._data.title}</h4>
            <p class="preview__publisher">${this._data.publisher}</p>
            <div class="preview__user-generated ${
              this._data.key ? '' : 'hidden'
            }">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
  }
}

export default new PreviewView();
