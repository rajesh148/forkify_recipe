// export const add = (a,b) => a+b;
// export const multiply = (a,b) => a*b;
// export const ID = 45;

import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link '));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
};

/**
 * //Pasta with tomato and spinach
 * 
 * acc : 0 / acc + cur.length (0 + 5(Pasta)) = 5 / newTitel = ['Pasta']
 * acc : 5 / acc + cur.length (5 + 4(with)) = 9 / newTitel = ['Pasta','with']
 * acc : 9 / acc + cur.length (9 + 6(tomato)) = 15 / newTitel = ['Pasta','with',tomato]
 * acc : 15 / acc + cur.length (15 + 7(spinach)) = 25 / newTitel = ['Pasta','with',tomato, 'spanich']
 */



export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }

            return acc + cur.length;

        },0);

        //RETURN THE RESULT
        return `${newTitle.join(' ')}...`;
    }

    return title;
};

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    
    `;

    elements.searchResultList.insertAdjacentHTML('beforeend',markup);
};

const createBtn = (page,type) => `
    <button class="btn-inline results__btn--${type}" data-goto = ${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderBtns = (page, numResults, resPerPage) => {

    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if(page === 1 && pages > 1) {
        //Only one button to goto next
        button = createBtn(page,'next');

    } else if(page < pages) {
        //Both buttons
        button = `
            ${button = createBtn(page,'prev')}
            ${button = createBtn(page,'next')}
        `;
    } else if(page === pages && pages > 1) {
        button = createBtn(page,'prev');
        //Only one button to goto prev page
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //rendere results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    //Renere the pagenation buttons
    renderBtns(page,recipes.length,resPerPage);
};