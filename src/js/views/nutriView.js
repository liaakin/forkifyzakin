import View from './view';
import icons from 'url:../../img/icons.svg';

/**
 * Class representing the nutritional information view.
 * Extends from the base View class.
 */
class NutriView extends View {
  _parentElement = document.querySelector('.recipe');

  /**
   * Adds an event listener to toggle the display of nutritional information.
   *
   * @param {Function} handler - The function to call when the button to show or hide nutritional information is clicked.
   */
  addHandlerShowOrHideNutri(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn =
        e.target.closest('.btn--nutri') || e.target.closest('.closeNutri');
      if (!btn) return;
      handler();
    });
  }

  /**
   * Toggles the visibility of the nutritional information and updates the displayed data.
   *
   * @param {Object} data - The nutritional data to display.
   * @param {number} dataKcal - The total calories to display.
   */
  toggleNutri(data, dataKcal) {
    document.querySelector('.nutri-list').classList.toggle('hidden');

    document.querySelector('.resultKcal').textContent = `Total: ${
      dataKcal === undefined ? '...' : dataKcal
    } kcal`;
    document.querySelector('.carb').textContent = `carb: ${
      data.carb === undefined ? '...' : data.carb
    } %`;
    document.querySelector('.fat').textContent = `fat: ${
      data.fat === undefined ? '...' : data.fat
    } %`;
    document.querySelector('.protein').textContent = `protein: ${
      data.protein === undefined ? '...' : data.protein
    } %`;
  }
}

export default new NutriView();
