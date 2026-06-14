class ShopBanner extends HTMLElement {
  connectedCallback() {
    this.loadSwiperAssets();
    this.innerHTML = `
      <a href="https://chapdaddy.buyshop.jp/" target="_blank" rel="noopener noreferrer"
          style="display: block; width: 100%; border-top: 2px solid #eee; background: #fff;">
          <img src="https://baseec-img-mng.akamaized.net/images/shop_front/chapdaddy-buyshop-jp/d9b4bcb4dd8bce8835bb44db10d7801b.jpg"
              alt="Chapdaddy Shop" style="width: 100%; height: auto; display: block;">
      </a>
    `;
  }

  loadSwiperAssets() {
    if (!document.getElementById('swiper-css')) {
      const link = document.createElement('link');
      link.id = 'swiper-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css';
      document.head.append(link);
    }

    if (!document.getElementById('swiper-js')) {
      const script = document.createElement('script');
      script.id = 'swiper-js';
      script.src = 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js';
      script.defer = true;
      document.head.append(script);
    }
  }
}

customElements.define('shop-banner', ShopBanner);
