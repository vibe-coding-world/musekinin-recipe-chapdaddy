class AppBreadcrumb extends HTMLElement {
  connectedCallback() {
    this.items = this.createItems();
    this.render();
    document.addEventListener('recipe-detail:loaded', this.handleDetailLoaded);
  }

  disconnectedCallback() {
    document.removeEventListener('recipe-detail:loaded', this.handleDetailLoaded);
  }

  handleDetailLoaded = (event) => {
    const title = event.detail?.title;

    if (!title || !this.isDetailPage()) {
      return;
    }

    this.items = this.createItems(title);
    this.render();
  };

  createItems(detailTitle = '詳細ページ') {
    if (this.isDetailPage()) {
      return [
        { label: 'HOME', href: 'index.html' },
        { label: '一覧', href: 'list.html' },
        { label: detailTitle },
      ];
    }

    if (this.isListPage()) {
      return [
        { label: 'HOME', href: 'index.html' },
        { label: '一覧' },
      ];
    }

    return [{ label: 'HOME' }];
  }

  isDetailPage() {
    return window.location.pathname.endsWith('/detail.html');
  }

  isListPage() {
    return window.location.pathname.endsWith('/list.html');
  }

  render() {
    this.innerHTML = `
      <nav class="c_breadcrumb" aria-label="パンくずリスト">
        <ol class="c_breadcrumb__list">
          ${this.items.map((item, index) => this.createItem(item, index)).join('')}
        </ol>
      </nav>
    `;
  }

  createItem(item, index) {
    const isCurrent = index === this.items.length - 1;
    const label = this.escapeHtml(item.label);

    if (isCurrent || !item.href) {
      return `<li class="c_breadcrumb__item" aria-current="page">${label}</li>`;
    }

    return `
      <li class="c_breadcrumb__item">
        <a class="c_breadcrumb__link" href="${this.escapeAttribute(item.href)}">${label}</a>
      </li>
    `;
  }

  escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  escapeAttribute(value) {
    return this.escapeHtml(value);
  }
}

customElements.define('app-breadcrumb', AppBreadcrumb);
