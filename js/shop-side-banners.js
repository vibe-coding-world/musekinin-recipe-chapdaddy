class ShopSideBanners extends HTMLElement {
  constructor() {
    super();
    this.groups = [
      {
        side: 'left',
        label: 'APRON｜着る',
        url: './data/shop-apron.json',
      },
      {
        side: 'right',
        label: 'TABLE｜食べる',
        url: './data/shop-table.json',
      },
    ];
  }

  connectedCallback() {
    this.init();
  }

  async init() {
    const groups = await Promise.all(
      this.groups.map(async (group) => ({
        ...group,
        items: this.pickItems(await this.fetchItems(group.url), 2),
      }))
    );

    const activeGroups = groups.filter((group) => group.items.length > 0);

    if (activeGroups.length === 0) {
      this.hidden = true;
      return;
    }

    this.hidden = false;
    this.innerHTML = activeGroups.map((group) => this.createColumn(group)).join('');
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

  pickItems(items, count) {
    return [...items]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }

  createColumn(group) {
    const side = this.escapeAttribute(group.side);
    const label = this.escapeAttribute(group.label);
    const items = group.items.map((item) => this.createItem(item)).join('');

    return `
      <aside class="c_side-banners c_side-banners--${side}" aria-label="${label}">
        <h2 class="text-hd-t02 c_side-banners__title">
          <img class="c_side-banners__icon" src="./assets/images/icon-chapdaddy.avif" alt="">
          <span>${label}</span>
        </h2>
        ${items}
      </aside>
    `;
  }

  createItem(item) {
    const name = this.escapeAttribute(item.name);
    const imageUrl = this.escapeAttribute(item.image_url);
    const productUrl = this.escapeAttribute(item.product_url);

    return `
      <a class="c_side-banners__item" href="${productUrl}" target="_blank" rel="noopener noreferrer">
        <img class="c_side-banners__image" src="${imageUrl}" alt="${name}" loading="lazy">
      </a>
    `;
  }

  escapeAttribute(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }
}

customElements.define('shop-side-banners', ShopSideBanners);

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('shop-side-banners')) {
    document.body.append(document.createElement('shop-side-banners'));
  }
});
