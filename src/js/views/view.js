import icons from 'url:../../img/icons.svg';

/**
 * Base class for all views in the application.
 * Handles rendering and updating of the view, including error and message handling.
 */
export default class View {
  _data; // Holds the data to be rendered

  /**
   * Renders the view with the provided data.
   * @param {Object|Object[]} data - The data to render. If empty, an error is rendered.
   * @param {boolean} [render=true] - If false, only markup is returned, not rendered.
   */
  render(data, render = true) {
    // If no data or empty array is provided, render an error
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Updates the view with new data without re-rendering the entire view.
   * Efficiently updates only changed parts of the DOM.
   * @param {Object} data - The new data to update the view with.
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // Create a new DOM fragment from the new markup
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // Update text content and attributes where they have changed
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Update text content if it has changed
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update attributes if they have changed
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  /**
   * Clears the content of the parent element.
   */
  _clear() {
    this._parentElement.innerHTML = '';
  }

  /**
   * Renders a spinner to indicate loading.
   */
  renderSpinner() {
    const markup = `<div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Renders an error message.
   * @param {string} [message=this._errorMsg] - The error message to display.
   */
  renderError(message = this._errorMsg) {
    const markup = `<div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Renders a general message (e.g., success message).
   * @param {string} [message=this._message] - The message to display.
   */
  renderMsg(message = this._message) {
    const markup = `<div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
