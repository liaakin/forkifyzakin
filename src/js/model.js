import { async } from 'regenerator-runtime';
import { API_URL, APIKEY, RES_PER_PAGE, NUTRI_KEY } from './config';
import { AJAX, AJAXNutri, AJAXdelete } from './helpers';

// Global application state
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  shopItems: [],
  ingredientData: {},
  kcalArray: [],
  resultKcal: 0,
  kcalBD: {},
};

/**
 * Creates a recipe object from API data.
 *
 * @param {Object} data - The API response data.
 * @returns {Object} - The formatted recipe object.
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // Conditionally adding properties to the object
  };
};

/**
 * Loads a recipe by its ID and updates the state.
 *
 * @param {string} id - The recipe ID.
 * @throws Will throw an error if the AJAX request fails.
 */
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${APIKEY}`);
    state.recipe = createRecipeObject(data);
    state.recipe.bookmarked = state.bookmarks.some(bm => bm.id === id);
  } catch (err) {
    console.error('Error loading recipe:', err);
    throw err;
  }
};

/**
 * Performs a search query and updates the state with the results.
 *
 * @param {string} query - The search query.
 * @throws Will throw an error if the AJAX request fails.
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${APIKEY}`);
    state.search.results = data.data.recipes.map(rec => ({
      id: rec.id,
      title: rec.title,
      publisher: rec.publisher,
      image: rec.image_url,
      ...(rec.key && { key: rec.key }),
    }));
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

/**
 * Returns the results for the current search page.
 *
 * @param {number} [page=state.search.page] - The page number.
 * @returns {Array} - The results for the specified page.
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

/**
 * Updates the servings in the recipe and adjusts ingredient quantities and total calories accordingly.
 *
 * @param {number} newServings - The new number of servings.
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQ = oldQ * newServings / oldServings
  });
  // Update calories
  const newKcal = (state.resultKcal / state.recipe.servings) * newServings;
  state.recipe.servings = newServings;
  state.resultKcal = Math.round(newKcal);
};

/**
 * Initializes the application state from local storage.
 */
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

/**
 * Saves bookmarks to local storage.
 */
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * Adds a recipe to the bookmarks and updates the state.
 *
 * @param {Object} recipe - The recipe to add to bookmarks.
 */
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

/**
 * Deletes a recipe from the bookmarks and updates the state.
 *
 * @param {string} id - The ID of the recipe to delete.
 */
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  if (index !== -1) {
    state.bookmarks.splice(index, 1);
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
  }
};

/**
 * Delete all bookmarks (for development purposes only)
 *  */
const clearBookmarks = function () {
  localStorage.removeItem('bookmarks');
};
// clearBookmarks();

/**
 * Uploads a new recipe to the server and adds it to bookmarks.
 *
 * @param {Array} newRecipe - The new recipe data.
 * @throws Will throw an error if the AJAX request fails.
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const allIngr = newRecipe
      .filter(entry => entry[0].startsWith('ingr'))
      .map(ingr => ingr[1]);
    const ingredients = Array(Math.ceil(allIngr.length / 3))
      .fill()
      .map((_, i) => allIngr.slice(i * 3, i * 3 + 3))
      .map(ingr => {
        const [description, quantity, unit] = ingr;
        return { description, quantity: quantity ? +quantity : null, unit };
      });
    const dataIngr = Object.fromEntries(newRecipe);
    const recipe = {
      title: dataIngr.title,
      source_url: dataIngr.sourceUrl,
      image_url: dataIngr.image,
      publisher: dataIngr.publisher,
      cooking_time: +dataIngr.cookingTime,
      servings: +dataIngr.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${APIKEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

/**
 * Initializes the shopping list from local storage.
 */
export const initShopList = function () {
  const store = localStorage.getItem('shopItems');
  if (store) state.shopItems = JSON.parse(store);
};

/**
 * Saves the shopping list to local storage.
 */
const persistShopItem = function () {
  localStorage.setItem('shopItems', JSON.stringify(state.shopItems));
};

/**
 * Adds an item to the shopping list and updates local storage.
 *
 * @param {Object} shopItem - The item to add to the shopping list.
 */
export const shopItemList = function (shopItem) {
  state.shopItems.push(shopItem);
  persistShopItem();
};

/**
 * Deletes an item from the shopping list and updates local storage.
 *
 * @param {number} index - The index of the item to delete.
 */
export const deleteShopList = function (index) {
  state.shopItems.splice(index, 1);
  persistShopItem();
};

/**
 * Returns the current shopping list.
 *
 * @returns {Array} - The current shopping list.
 */
export const getShopItems = function () {
  return state.shopItems;
};

/**
 * Fetches nutritional information for a given ingredient.
 *
 * @param {number} quantity - The quantity of the ingredient.
 * @param {string} unit - The unit of measurement.
 * @param {string} description - The description of the ingredient.
 * @throws Will throw an error if the AJAX request fails.
 */
export const getNutrition = async function (quantity, unit, description) {
  try {
    // Construct ingredient string
    const ingredientString = `${quantity} ${unit} ${description}`;
    // Fetch nutritional data
    const ingredientData = await AJAXNutri(ingredientString, NUTRI_KEY);
    // Check for nutrients data
    console.log(ingredientData);
    const nutrients = ingredientData?.[0]?.nutrition?.nutrients;
    if (!nutrients) return;

    // Find calories in the nutrients array
    const caloriesNutrient = nutrients.find(
      ({ name }) => name.toLowerCase() === 'calories'
    );
    if (!caloriesNutrient) return;

    // Sum calories of all ingredients
    state.resultKcal += Math.round(caloriesNutrient.amount);

    // Get nutritional breakdown (percentages)
    const percents = ingredientData[0].nutrition.caloricBreakdown;
    state.ingredientData.kcalBd = {
      carb: percents.percentCarbs,
      fat: percents.percentFat,
      protein: percents.percentProtein,
    };
    state.kcalArray.push(state.ingredientData.kcalBd);
    const totals = state.kcalArray.reduce(
      (acc, item) => {
        acc.carb += item.carb;
        acc.fat += item.fat;
        acc.protein += item.protein;
        return acc;
      },
      { carb: 0, fat: 0, protein: 0 }
    );

    // Calculate total macronutrient percentages
    const totalMacros = totals.carb + totals.fat + totals.protein;
    state.resultKcal === 0
      ? (state.kcalBD = {
          carb: 0,
          fat: 0,
          protein: 0,
        })
      : (state.kcalBD = {
          carb: Math.round(totals.carb * (100 / totalMacros)),
          fat: Math.round(totals.fat * (100 / totalMacros)),
          protein: Math.round(totals.protein * (100 / totalMacros)),
        });
  } catch (err) {
    // console.error('Error fetching nutrition data:', error);
    throw err;
  }
};

/**
 * Asynchronous function to delete a recipe by ID.
 *
 * @param {string} id - The ID of the recipe to delete.
 *
 * @throws Will throw an error if the delete operation fails.
 */
export const deleteRecipe = async id => {
  try {
    // Set the recipe ID in the state
    state.recipe.id = id;

    // Remove the recipe from bookmarks
    deleteBookmark(id);

    // Perform the DELETE request via AJAX
    const data = await AJAXdelete(`${API_URL}${id}?key=${APIKEY}`);

    // console.log('Recipe deleted successfully:', data);
  } catch (err) {
    // Re-throw the error to be handled by the caller
    throw new Error(`Failed to delete recipe: ${err.message}`);
  }
};
