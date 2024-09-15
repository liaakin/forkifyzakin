import View from './view';
import icons from 'url:../../img/icons.svg';

/**
 * Class representing the pagination view.
 * Extends from the base View class.
 */
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  /**
   * Adds an event listener to handle pagination button clicks.
   *
   * @param {Function} handler - The function to call when a pagination button is clicked.
   */
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;
      const goToPage = +btn.dataset.goto; // Save page number from button's data attribute
      handler(goToPage); // Pass the page number to the handler function
    });
  }

  /**
   * Generates the markup for the pagination buttons based on the current page and number of pages.
   *
   * @returns {string} - The HTML markup for the pagination buttons.
   */
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `  
      <div class="noPage">   
          </div>
      <div class="pagination--curPage">
            ${curPage} / ${numPages}
        </div>
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
       <div class="curPage"> 
          <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>      
          </button>  
          `;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return ` 
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button> 
          <div class="pagination--curPage">
            ${curPage} / ${numPages}
        </div>
          <div class="noPage">   
          </div>
          `;
    }

    // Other pages
    if (curPage < numPages) {
      return ` 
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button> 

      <div class="pagination--curPage">
            ${curPage} / ${numPages}
        </div>

      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
          `;
    }

    // Page 1 and no other pages
    return '';
  }
}

export default new PaginationView();
