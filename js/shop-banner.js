class ShopBanner extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <a href="https://chapdaddy.buyshop.jp/" target="_blank"
          style="display: block; width: 100%; border-top: 2px solid #eee; background: #fff;">
          <img src="https://baseec-img-mng.akamaized.net/images/shop_front/chapdaddy-buyshop-jp/d9b4bcb4dd8bce8835bb44db10d7801b.jpg"
              alt="Chapdaddy Shop" style="width: 100%; height: auto; display: block;">
      </a>
    `;
  }
}
customElements.define('shop-banner', ShopBanner);
