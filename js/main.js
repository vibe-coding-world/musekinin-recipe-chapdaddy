async function initProgressSlider() {
  const sections = document.querySelectorAll('.c_step-section');

  if (sections.length === 0) {
    return;
  }

  const swiperReady = await loadSwiperAssets();

  if (!swiperReady || !window.Swiper) {
    return;
  }

  sections.forEach(initStepSwiper);
}

function initStepSwiper(section) {
  const slider = section.querySelector('.c_slider');
  const track = section.querySelector('.c_slider__track');
  const slides = section.querySelectorAll('.c_slide');
  const pagination = section.querySelector('.c_progress__bar');

  if (!slider || !track || slides.length === 0 || !pagination || slider.dataset.stepSwiperReady) {
    return;
  }

  slider.dataset.stepSwiperReady = 'true';
  slider.classList.add('c_step-swiper');
  pagination.innerHTML = '';

  const prevButton = createStepNavButton('prev');
  const nextButton = createStepNavButton('next');
  slider.append(prevButton, nextButton);

  const swiper = new window.Swiper(slider, {
    wrapperClass: 'c_slider__track',
    slideClass: 'c_slide',
    slidesPerView: 1,
    spaceBetween: 0,
    autoHeight: true,
    loop: false,
    autoplay: false,
    observer: true,
    observeParents: true,
    pagination: {
      el: pagination,
      clickable: true,
      bulletClass: 'c_progress__item',
      bulletActiveClass: 'active',
      renderBullet: (index, className) => (
        `<button class="${className}" type="button" aria-label="手順 ${index + 1}"></button>`
      ),
    },
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
  });

  slider.querySelectorAll('img').forEach((image) => {
    image.addEventListener('load', () => swiper.update(), { once: true });
  });
}

function createStepNavButton(direction) {
  const button = document.createElement('button');
  const isPrev = direction === 'prev';

  button.className = `c_step-nav c_step-nav--${direction}`;
  button.type = 'button';
  button.setAttribute('aria-label', isPrev ? '前の手順' : '次の手順');
  button.innerHTML = `
    <span class="material-symbols-outlined" aria-hidden="true">
      ${isPrev ? 'chevron_left' : 'chevron_right'}
    </span>
  `;

  return button;
}

function loadSwiperAssets() {
  if (window.Swiper) {
    return Promise.resolve(true);
  }

  loadSwiperCss();
  return loadSwiperScript();
}

function loadSwiperCss() {
  if (document.getElementById('swiper-css')) {
    return;
  }

  const link = document.createElement('link');
  link.id = 'swiper-css';
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css';
  document.head.append(link);
}

function loadSwiperScript() {
  const existingScript = document.getElementById('swiper-js');

  if (existingScript) {
    return new Promise((resolve) => {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.id = 'swiper-js';
    script.src = 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.append(script);
  });
}

document.addEventListener('DOMContentLoaded', initProgressSlider);
window.initProgressSlider = initProgressSlider;
