// Reused functions for handling API requests with timeout
import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

/**
 * Function to set a timeout for API requests.
 * If the request takes longer than the specified time, it will reject with an error.
 *
 * @param {number} s - The timeout duration in seconds.
 * @returns {Promise} - A promise that rejects after the specified timeout.
 */
const timeout = s => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * General function to handle API requests (GET or POST) with a timeout.
 *
 * @param {string} url - The API endpoint URL.
 * @param {Object} [uploadData] - Optional data to be uploaded in case of a POST request.
 * @returns {Object} - The response data from the API.
 * @throws Will throw an error if the request fails.
 */
export const AJAX = async (url, uploadData = undefined) => {
  try {
    // Handle GET or POST requests based on the presence of uploadData
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // Race between the API request and the timeout
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    // Throw error if the response is not OK
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * Function to handle nutrition data API request for parsing ingredients.
 * Sends a POST request with ingredient information to an API and retrieves nutrition data.
 *
 * @param {string} string - The ingredient list to be parsed.
 * @param {string} key - The API key for authentication.
 * @returns {Object} - The parsed ingredient data including nutrition information.
 * @throws Will throw an error if the request fails.
 */
export const AJAXNutri = async (string, key) => {
  try {
    // Send a POST request to the nutrition API
    const fetchPromise = fetch(
      `https://api.spoonacular.com/recipes/parseIngredients?ingredientList=${string}&includeNutrition=true`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-api-key': `${key}`,
        },
      }
    );

    // Race between the API request and the timeout
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const recievedData = await response.json();

    // Throw error if no data is received or there is an issue
    if (!recievedData) {
      throw new Error(recievedData.message);
    }

    return recievedData;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Asynchronous function to delete a recipe from the API.
 *
 * @param {string} recipeId - The ID of the recipe to delete.
 * @param {string} key - The API key for authorization.
 *
 * @throws Will throw an error if the fetch operation fails or the response is not OK.
 */
export const AJAXdelete = async url => {
  // Construct the URL for the DELETE request
  // const url = `https://forkify-api.herokuapp.com/api/v2/recipes/${recipeId}?key=${key}`;

  try {
    // Perform the DELETE request
    const response = await fetch(url, {
      method: 'DELETE',
    });

    // Check if the response is not OK
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    // console.log('Recipe deleted successfully');
  } catch (err) {
    // console.error('Error deleting recipe:', error);
    throw new Error(err);
  }
};
