// Import necessary modules and views
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeViews from './views/recipeViews.js';
import searchViews from './views/searchViews.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import shoppingListView from './views/shoppingListView.js';
import nutriView from './views/nutriView.js';
import 'core-js/stable'; // For polyfills (ES6+ features support in older browsers)
import 'regenerator-runtime/runtime'; // For async/await support in older browsers
import { Fraction } from 'fractional'; // Utility to work with fractions
import previewView from './views/previewView.js';

// Stop page reload in development mode (Hot Module Replacement)
if (module.hot) {
  module.hot.accept();
}

///////////////////////////////////////
// Controller for handling recipe logic

/**
 * Control loading and displaying a recipe based on the URL hash.
 */
const controlRecipes = async function () {
  try {
    // Extract recipe ID from the URL hash
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Show loading spinner while fetching recipe data
    recipeViews.renderSpinner();

    // Update search results to highlight the selected recipe
    resultsView.update(model.getSearchResultsPage());

    // Update the bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // Load the selected recipe from the API
    await model.loadRecipe(id);

    // Render the recipe
    recipeViews.render(model.state.recipe);

    // Calculate and render nutrition information (calories) for each ingredient
    model.state.recipe.ingredients.forEach(
      async ({ quantity = '', unit = '', description }) => {
        model.state.resultKcal = 0;
        model.state.kcalArray = [];
        await model.getNutrition(quantity, unit, description);
      }
    );
  } catch (err) {
    console.log(err);
    recipeViews.renderError();
  }
};

/**
 * Control search results: Get query, fetch results, and render them.
 */
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner(); // Show spinner while fetching data

    // Get the search query from the user input
    const query = searchViews.getQuery();
    if (!query) return;

    // Load search results from the API based on the query
    await model.loadSearchResults(query);

    // Render the first page of results
    resultsView.render(model.getSearchResultsPage(1));

    // Display the total number of results found for the query
    resultsView.recipeAmounts(model.state.search.results.length, query);

    // Render pagination buttons
    paginationView.render(model.state.search);

    // Sort search results alphabetically
    model.state.search.results.abc = model.state.search.results
      .map(res => res.title)
      .sort((a, b) => a.localeCompare(b));

    // Enable sorting functionality on the UI
    if (model.state.search.results.abc.length > 0);
    resultsView.sortBtn();
  } catch (err) {
    console.error(err);
  }
};

/**
 * Control pagination: Render results and pagination buttons for the selected page.
 */
const controlPagination = function (goToPage) {
  // Render the results for the selected page
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render pagination buttons for the selected page
  paginationView.render(model.state.search);
};

/**
 * Control recipe servings update.
 *
 * @param {number} newServings - The new number of servings.
 */
const controlServings = function (newServings) {
  // Update the recipe servings in the state
  model.updateServings(newServings);

  // Update the displayed recipe to reflect the new servings
  recipeViews.update(model.state.recipe);
};

/**
 * Control adding or removing a recipe bookmark.
 */
const controlAddBookmark = function () {
  // Add or remove the recipe bookmark based on its current state
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update the recipe view to reflect bookmark status
  recipeViews.update(model.state.recipe);

  // Render updated bookmarks
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Control rendering bookmarks on page load.
 */
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Control adding a new recipe.
 *
 * @param {Object} newRecipe - The new recipe data.
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show a loading spinner while uploading the recipe
    addRecipeView.renderSpinner();

    // Upload the new recipe data to the API
    await model.uploadRecipe(newRecipe);

    // Render the newly added recipe
    recipeViews.render(model.state.recipe);

    // Show success message
    addRecipeView.renderMsg();

    // Render updated bookmarks
    bookmarksView.render(model.state.bookmarks);

    // Change the URL to the new recipe ID without reloading the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close the recipe form after a short delay
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('***', err);
    addRecipeView.renderError(err.message);
  }
};

/**
 * Control adding items to the shopping list.
 *
 * @param {Object} shopItem - The shopping item to add.
 */
const controlShopList = function (shopItem) {
  model.shopItemList(shopItem);
  controlUpdateShoppingListView();
};

/**
 * Control deleting items from the shopping list.
 *
 * @param {number} index - The index of the item to remove.
 */
const controlDeleteShopItem = function (index) {
  model.deleteShopList(index);
  controlUpdateShoppingListView();
};

/**
 * Update the shopping list view.
 */
const controlUpdateShoppingListView = function () {
  model.initShopList();
  const items = model.state.shopItems;

  if (items.length === 0) {
    shoppingListView.renderMsg(shoppingListView._errorMsg);
  } else {
    shoppingListView.renderList(items);
  }
};

/**
 * Control displaying nutritional information.
 */
const controlNutri = function () {
  nutriView.toggleNutri(model.state.kcalBD, model.state.resultKcal);
};

/**
 * Control sorting search results alphabetically.
 */
const controlSearchResABC = function () {
  const sortedTitles = model.state.search.results.abc;

  if (!model.state.search.results || !model.state.search.results.abc) {
    // console.log('You already sortet the list.');
    resultsView.hideSortBtn();
    return;
  }

  // Sort search results by the sorted titles
  model.state.search.results = model.state.search.results
    .map(result => ({
      ...result,
      title: result.title,
    }))
    .sort(
      (a, b) => sortedTitles.indexOf(a.title) - sortedTitles.indexOf(b.title)
    );

  // Re-render the sorted search results and pagination
  resultsView.render(model.getSearchResultsPage(1));
  paginationView.render(model.state.search);
};

/**
 * Handle the deletion of a recipe.
 *
 * Function extracts the recipe ID from the URL hash, deletes the recipe
 * using the model, updates the bookmarks, and renders the success or error message.
 *
 * @throws Will render an error message if the delete operation fails.
 */
const controlDeleteRecipe = async () => {
  try {
    // Extract the recipe ID from the URL hash
    const id = window.location.hash.slice(1);

    // If no ID is found in the hash, exit the function
    if (!id) return;

    // Delete the recipe from the model
    await model.deleteRecipe(id);

    // Remove the recipe from the bookmarks
    model.deleteBookmark(id);

    // Render a success message
    recipeViews.renderMsg('Recipe deleted successfully.');

    // Update the bookmarks view
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    // Render an error message if something goes wrong
    recipeViews.renderError();
  }
};

const init = function () {
  shoppingListView.addHandlerRender(controlUpdateShoppingListView);
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeViews.addHandlerRender(controlRecipes);
  recipeViews.addHandlerUpdateServings(controlServings);
  recipeViews.addHandlerAddBookmark(controlAddBookmark);
  searchViews.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  recipeViews.addHandleraddShopItem(controlShopList);
  shoppingListView.deleteItem(controlDeleteShopItem);
  nutriView.addHandlerShowOrHideNutri(controlNutri);
  resultsView.sortABC(controlSearchResABC);
  recipeViews.addHandlerDeleteRecipe(controlDeleteRecipe);
};
init();
