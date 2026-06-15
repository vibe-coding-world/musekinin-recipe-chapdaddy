document.addEventListener('DOMContentLoaded', () => {
  const contentElement = document.querySelector('[data-detail-content]');
  const errorElement = document.querySelector('[data-detail-error]');

  if (!contentElement || !errorElement) {
    return;
  }

  initDetailPage(contentElement, errorElement);
});

async function initDetailPage(contentElement, errorElement) {
  const detailId = getDetailId();

  if (!detailId) {
    renderDetailError(errorElement);
    return;
  }

  const detailIndex = await fetchDetailIndex();
  const detail = detailIndex.find((item) => item.id === detailId);

  if (!detail) {
    renderDetailError(errorElement);
    return;
  }

  const html = await fetchDetailHtml(detail.html);

  if (!html) {
    renderDetailError(errorElement);
    return;
  }

  document.title = `${detail.title} - Chapdaddy 無責任レシピ`;
  contentElement.innerHTML = html;
  errorElement.hidden = true;
  document.dispatchEvent(new CustomEvent('recipe-detail:loaded', {
    detail: {
      title: detail.title,
    },
  }));

  if (window.initProgressSlider) {
    window.initProgressSlider();
  }
}

function getDetailId() {
  return new URLSearchParams(window.location.search).get('id') || '';
}

async function fetchDetailIndex() {
  try {
    const response = await fetch('./data/recipe-details.json');

    if (!response.ok) {
      return [];
    }

    const items = await response.json();
    return Array.isArray(items) ? items.filter(isValidDetail) : [];
  } catch {
    return [];
  }
}

function isValidDetail(item) {
  return item.id && item.title && item.html;
}

async function fetchDetailHtml(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return '';
    }

    return response.text();
  } catch {
    return '';
  }
}

function renderDetailError(errorElement) {
  errorElement.hidden = false;
}
