/**
 * `SearchView` is a class responsible for handling the search functionality.
 * It manages the search input and provides methods to retrieve the search query
 * and clear the search field.
 */
class SearchView {
  // The element where the search form is located
  _parentElement = document.querySelector('.search');

  /**
   * Retrieves the current search query from the input field,
   * hides the sort button, and clears the input field.
   * @returns {string} - The search query entered by the user.
   */
  getQuery() {
    // Hide the sort button
    document.querySelector('.abc').classList.add('hidden');
    // Get the value from the search input field
    const query = this._parentElement.querySelector('.search__field').value;
    // Clear the input field
    this._clearInput();
    // Return the search query
    return query;
  }

  /**
   * Clears the value of the search input field.
   */
  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  /**
   * Adds an event listener to the search form to handle the search action.
   * Prevents the default form submission behavior and calls the provided
   * `handler` function when the form is submitted.
   * @param {Function} handler - The function to be called when the form is submitted.
   */
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
