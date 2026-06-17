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
        slots: this.createSlots(await this.fetchItems(group.url), 2, 4),
      }))
    );

    const activeGroups = groups.filter((group) => group.slots.length > 0);

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

  createSlots(items, slotCount, itemsPerSlot) {
    const shuffledItems = this.pickItems(items, slotCount * itemsPerSlot);
    const slots = [];

    for (let index = 0; index < slotCount; index += 1) {
      const start = index * itemsPerSlot;
      const slotItems = shuffledItems.slice(start, start + itemsPerSlot);

      if (slotItems.length > 0) {
        slots.push(slotItems);
      }
    }

    if (slots.length === slotCount) {
      this.fillSlots(slots, shuffledItems, itemsPerSlot);
    }

    return slots;
  }

  fillSlots(slots, sourceItems, itemsPerSlot) {
    slots.forEach((slotItems, slotIndex) => {
      let offset = 0;

      while (slotItems.length < itemsPerSlot && sourceItems.length > 0) {
        const displayIndex = slotItems.length;
        const candidate = this.findFillItem(sourceItems, slots, slotIndex, displayIndex, offset);

        if (!candidate) {
          break;
        }

        slotItems.push(candidate);
        offset += 1;
      }
    });
  }

  findFillItem(sourceItems, slots, slotIndex, displayIndex, offset) {
    const currentSlot = slots[slotIndex];
    const otherSlot = slots.find((slotItems, index) => index !== slotIndex && slotItems.length > 0);

    return sourceItems.find((item, index) => {
      if (index < offset) {
        return false;
      }

      const sameSlotDuplicate = currentSlot.some((slotItem) => slotItem.product_url === item.product_url);
      const sameTimeDuplicate = otherSlot?.[displayIndex]?.product_url === item.product_url;

      return !sameSlotDuplicate && !sameTimeDuplicate;
    });
  }

  createColumn(group) {
    const side = this.escapeAttribute(group.side);
    const label = this.escapeAttribute(group.label);
    const slots = group.slots.map((slotItems) => this.createSlot(slotItems)).join('');

    return `
      <aside class="c_side-banners c_side-banners--${side}" aria-label="${label}">
        <div class="c_heading c_heading--center">
          <img class="c_heading__icon c_heading__icon--chapdaddy" src="./assets/images/icon-chapdaddy.avif" alt="">
          <h2 class="text-hd-t02">${label}</h2>
        </div>
        ${slots}
      </aside>
    `;
  }

  createSlot(items) {
    const links = items.map((item) => this.createItem(item)).join('');
    const count = this.escapeAttribute(items.length);

    return `
      <div class="c_side-banners__slot">
        <div class="c_side-banners__fade c_side-banners__fade--count-${count}">
          ${links}
        </div>
      </div>
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
