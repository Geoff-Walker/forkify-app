import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

if (module.hot) {
	module.hot.accept();
}

const controlRecipes = async function() {
	try {
		const id = window.location.hash.slice(1);

		if (!id) return;
		recipeView.renderSpinner();
		/////// 1. Loading a Recipe

		await model.loadRecipe(id);

		//// 2. Rendering a Recipe
		recipeView.render(model.state.recipe);
	} catch (err) {
		recipeView.renderError();
	}
};

const controlSearchResults = async function() {
	try {
		resultsView.renderSpinner();

		// 1 Get search query
		const query = searchView.getQuery();
		if (!query) return;
		///Load Search results
		await model.loadSearchResults(query);
		// render results
		resultsView.render(model.state.search.results);
	} catch (err) {
		console.log(err);
	}
};

const init = function() {
	recipeView.addHandlerRender(controlRecipes);
	searchView.addhandlerSearch(controlSearchResults);
};

init();
