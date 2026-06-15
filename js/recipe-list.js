document.addEventListener('DOMContentLoaded', () => {
  const filterElement = document.querySelector('[data-recipe-filter]');
  const listElement = document.querySelector('[data-recipe-list]');
  const homeListElement = document.querySelector('[data-home-recipe-list]');
  const countElement = document.querySelector('[data-recipe-count]');
  const emptyElement = document.querySelector('[data-recipe-empty]');

  if (filterElement && listElement) {
    initRecipeList({
      filterElement,
      listElement,
      countElement,
      emptyElement,
    });
  }

  if (homeListElement) {
    initHomeRecipes(homeListElement);
  }
});

async function initRecipeList(elements) {
  const data = await fetchRecipeData();

  if (!data) {
    return;
  }

  const activeMood = getActiveMood(data.moods);
  const recipes = getVisibleRecipes(data.recipes, activeMood);
  const randomRecipes = shuffleRecipes(recipes);

  renderFilters(elements.filterElement, data.moods, activeMood);
  renderRecipes(elements.listElement, randomRecipes);
  renderCount(elements.countElement, randomRecipes.length);
  renderEmpty(elements.emptyElement, randomRecipes.length);
}

async function initHomeRecipes(listElement) {
  const data = await fetchRecipeData();

  if (!data) {
    return;
  }

  const recipes = shuffleRecipes(data.recipes.filter(isValidRecipe)).slice(0, 3);

  if (recipes.length === 0) {
    return;
  }

  renderRecipes(listElement, recipes);
}

async function fetchRecipeData() {
  try {
    const response = await fetch('./data/recipes.json');

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!Array.isArray(data.moods) || !Array.isArray(data.recipes)) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

function getActiveMood(moods) {
  const mood = new URLSearchParams(window.location.search).get('mood');

  if (!mood || !moods.some((item) => item.id === mood)) {
    return '';
  }

  return mood;
}

function getVisibleRecipes(recipes, activeMood) {
  const validRecipes = recipes.filter(isValidRecipe);

  if (!activeMood) {
    return validRecipes;
  }

  return validRecipes.filter((recipe) => recipe.moods.includes(activeMood));
}

function shuffleRecipes(recipes) {
  const shuffledRecipes = [...recipes];

  for (let index = shuffledRecipes.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledRecipes[index], shuffledRecipes[randomIndex]] = [shuffledRecipes[randomIndex], shuffledRecipes[index]];
  }

  return shuffledRecipes;
}

function isValidRecipe(recipe) {
  return recipe.title
    && recipe.file
    && recipe.image
    && recipe.scene
    && recipe.time
    && recipe.difficulty
    && recipe.calories
    && Array.isArray(recipe.moods);
}

function renderFilters(filterElement, moods, activeMood) {
  const links = [
    createFilterLink('list.html', '全部', !activeMood),
    ...moods.map((mood) => createFilterLink(
      `list.html?mood=${encodeURIComponent(mood.id)}`,
      mood.label,
      mood.id === activeMood
    )),
  ];

  filterElement.innerHTML = links.join('');
}

function createFilterLink(href, label, active) {
  const activeClass = active ? ' c_filter-tag--active' : '';

  return `<a class="c_filter-tag${activeClass}" href="${escapeAttribute(href)}">${escapeHtml(label)}</a>`;
}

function renderRecipes(listElement, recipes) {
  listElement.innerHTML = recipes.map(createRecipeCard).join('');
}

function createRecipeCard(recipe, index) {
  const featuredClass = index === 0 ? ' c_list-recipe--featured' : '';

  return `
    <a class="c_list-recipe${featuredClass}" href="${escapeAttribute(recipe.file)}">
      <img class="c_list-recipe__image" src="${escapeAttribute(recipe.image)}" alt="${escapeAttribute(recipe.title)}" loading="lazy">
      <span class="c_list-recipe__body">
        <small class="c_list-recipe__scene">${escapeHtml(recipe.scene)}</small>
        <strong class="text-hd-t03">${escapeHtml(recipe.title)}</strong>
        <span class="la_cluster c_list-recipe__meta">
          <span>${escapeHtml(recipe.time)}</span>
          <span>${escapeHtml(recipe.difficulty)}</span>
          <span>${escapeHtml(recipe.calories)}</span>
        </span>
      </span>
    </a>
  `;
}

function renderCount(countElement, count) {
  if (!countElement) {
    return;
  }

  countElement.textContent = `${count}件`;
}

function renderEmpty(emptyElement, count) {
  if (!emptyElement) {
    return;
  }

  emptyElement.hidden = count > 0;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
