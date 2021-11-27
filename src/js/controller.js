import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if (module.hot) {
// 	module.hot.accept();
// }

const controlRecipes = async function() {
	try {
		const id = window.location.hash.slice(1);

		if (!id) return;
		recipeView.renderSpinner();
		/// results view to mark selected search results
		resultsView.update(model.getSearchResultsPage());

		///updating bookmarks view
		bookmarksView.update(model.state.bookMarks);
		/////// 1. Loading a Recipe

		await model.loadRecipe(id);

		//// 2. Rendering a Recipe
		recipeView.render(model.state.recipe);
	} catch (err) {
		recipeView.renderError();
		console.log(err);
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
		// resultsView.render(model.state.search.results);
		resultsView.render(model.getSearchResultsPage());

		///4 Render initial pagination btn
		paginationView.render(model.state.search);
	} catch (err) {
		console.log(err);
	}
};

const controlPagination = function(goToPage) {
	// Render new results
	resultsView.render(model.getSearchResultsPage(goToPage));

	///4 Render new pagination btn
	paginationView.render(model.state.search);
};

const controlServings = function(newServings) {
	//Update the recipe servings in the state
	model.updateServings(newServings);
	///Update the recipe view

	// recipeView.render(model.state.recipe);
	recipeView.update(model.state.recipe);
};

const controlAddBookmark = function() {
	// 1 ad/remove bookmark
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);

	// update recipe view
	recipeView.update(model.state.recipe);

	//render bookmarks
	bookmarksView.render(model.state.bookMarks);
};

const controlBookmarks = function() {
	bookmarksView.render(model.state.bookMarks);
};

const init = function() {
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	searchView.addhandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
};

init();
