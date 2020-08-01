/*
import str from './models/Search'
// import { add as a, multiply as m, ID} from './views/searchView'
import * as searchView from './views/searchView'
console.log(`Using imported functions!! ${searchView.add(searchView.ID,2)} and ${searchView.multiply(7,9)}. ${str}`);   
*/

import Search from './models/Search';

import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

import { elements,renderLoader,clearLoader } from './views/base';


/** Global state of the app
 * - Search object
 * - Current Recipe app
 * - shoping list object
 * - light recipes
 */
const state = {}

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () =>{
    // 1) Get the query from view
    const query = searchView.getInput();
    // console.log(query);

    if(query) {
        //2. New search Object and add to state
        state.search = new Search(query);

        //3. Prepare UI for result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);

        try {
            //4. Search for Recipes
            await state.search.getResults();
    
            //5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch(err) {
            alert('Something wrong with the search...');
            clearLoader();
        }
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e=> {

    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const gotoPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,gotoPage);
    }
});

/**
 * RECIPE CONTROLLER
 */

 const controlRecipe = async () => {
    // Get id from URL
    const id = window.location.hash.replace('#','');
    console.log(id);

    if(id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if(state.search) searchView.highlightSelected(id);

        //Create new recipe object
        state.recipe = new Recipe(id);

        try{
            //Get Recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            console.log(state.recipe);
            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            //Reneder recipe
            clearLoader();
            recipeView.renderRecipe (
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch(err) {
            console.log(err);
            alert('Error Processing recipe!!');
        }

    }
 };
 
//  window.addEventListener('hashchange', controlRecipe);
//  window.addEventListener('load',controlRecipe);

 ['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));

/**
 * LIST CONTROLLER
 */

const controlList = () => {
    //Create a new List if there is none yer(not created at)
    if(!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count,el.unit,el.ingredient);
        listView.renderItem(item);
    });
};

// Handle delete and update list item events
elements.shopping.addEventListener('click',e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from the state
        state.list.deleteItem(id);

        // Delete from the UI
        listView.deleteItem(id);

        //Hnadle the count update 
    } else if(e.target.matches('.shopping__count-value')) {
        const val =  parseFloat(e.target.value,10);
        state.list.updateCount(id,val);

    }
});


/**
 * LIKE CONTROLLER
 */

const controlLike = () => {
    if(!state.likes) state.likes = new Likes();

    const currentId = state.recipe.id;

    //User has NOT yet liked current recipe
    if(!state.likes.isLiked(currentId)) {
        //Add like to the state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img,
        );

        //Toggle the like button
        likesView.toggleLikeBtn(true);

        //Add like to UI list
        likesView.renderLike(newLike);

    //User HAS liked current recipe
    } else {

        //Remove like from the state
        state.likes.deleteLike(currentId);

        //Toggle the like button
        likesView.toggleLikeBtn(false);

        //Remove like from UI list
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikesMenu(state.likes.getNumOfLikes());
};

//Resote liked Recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    //Restore likes
    state.likes.readFromStorage();

    //Toggle like menu button 
    likesView.toggleLikesMenu(state.likes.getNumOfLikes());

    //Rendere the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));

});

 //Handling recipe button clicks
 elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Adds ingredients to shopping list
        controlList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        //Like controller
        controlLike();
    }
 });
