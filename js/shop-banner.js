class ShopBanner extends HTMLElement {
  constructor() {
    super();
    this.swipers = [];
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.groups = [
      {
        title: 'APRON｜着る',
        url: './data/shop-apron.json',
      },
      {
        title: 'TABLE｜食べる',
        url: './data/shop-table.json',
      },
    ];
  }

  connectedCallback() {
    this.renderLoading();
    this.init();
  }

  disconnectedCallback() {
    this.swipers.forEach((swiper) => swiper.destroy(true, true));
    this.swipers = [];
  }

  async init() {
    const [groups, swiperReady] = await Promise.all([
      this.loadGroups(),
      this.loadSwiperAssets(),
    ]);

    const activeGroups = groups.filter((group) => group.items.length > 0);

    if (activeGroups.length === 0) {
      this.hidden = true;
      return;
    }

    this.hidden = false;
    this.innerHTML = activeGroups.map((group) => this.createGroup(group)).join('');

    if (swiperReady && window.Swiper) {
      this.initSwipers();
    }
  }

  async loadGroups() {
    return Promise.all(
      this.groups.map(async (group) => ({
        ...group,
        items: await this.fetchItems(group.url),
      }))
    );
  }

  async fetchItems(url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        return [];
      }

      const items = await response.json();
      return Array.isArray(items) ? items.filter(this.isValidItem) : [];
    } catch {
      return [];
    }
  }

  isValidItem(item) {
    return item.name && item.image_url && item.product_url;
  }

  renderLoading() {
    this.hidden = false;
    this.innerHTML = `
      <section class="c_shop-carousel" aria-label="Chapdaddy shop">
        <p class="c_shop-carousel__loading">読み込み中</p>
      </section>
    `;
  }

  createGroup(group) {
    const title = this.escapeAttribute(group.title);
    const slides = group.items.map((item) => this.createSlide(item)).join('');

    return `
      <section class="c_shop-carousel" aria-label="${title}">
        <h2 class="text-hd-t02">
          <img class="c_shop-carousel__icon" src="./assets/images/icon-chapdaddy.avif" alt="">
          <span>${title}</span>
        </h2>
        <div class="swiper c_shop-carousel__swiper" data-shop-swiper>
          <div class="swiper-wrapper">
            ${slides}
          </div>
        </div>
      </section>
    `;
  }

  createSlide(item) {
    const name = this.escapeAttribute(item.name);
    const imageUrl = this.escapeAttribute(item.image_url);
    const productUrl = this.escapeAttribute(item.product_url);

    return `
      <a class="swiper-slide c_shop-carousel__slide" href="${productUrl}" target="_blank" rel="noopener noreferrer">
        <img class="c_shop-carousel__image" src="${imageUrl}" alt="${name}" loading="lazy">
      </a>
    `;
  }

  initSwipers() {
    this.swipers = [...this.querySelectorAll('[data-shop-swiper]')].map((swiperElement) => {
      const slideCount = swiperElement.querySelectorAll('.swiper-slide').length;

      return new window.Swiper(swiperElement, {
        loop: slideCount > 1,
        centeredSlides: true,
        slidesPerView: 1.35,
        spaceBetween: 16,
        speed: 420,
        autoplay: this.reduceMotion || slideCount <= 1
          ? false
          : {
            delay: 3000,
            disableOnInteraction: false,
          },
      });
    });
  }

  loadSwiperAssets() {
    if (window.Swiper) {
      return Promise.resolve(true);
    }

    this.loadSwiperCss();
    return this.loadSwiperScript();
  }

  loadSwiperCss() {
    if (document.getElementById('swiper-css')) {
      return;
    }

    const link = document.createElement('link');
    link.id = 'swiper-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css';
    document.head.append(link);
  }

  loadSwiperScript() {
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

  escapeAttribute(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }
}

customElements.define('shop-banner', ShopBanner);
