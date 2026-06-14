class AppHeader extends HTMLElement {
  connectedCallback() {
    const backHref = this.getAttribute('back-href');
    const title = this.getAttribute('title') || 'Chapdaddy';
    const subtitle = this.getAttribute('subtitle');

    if (backHref) {
      this.innerHTML = `
        <header class="c_site-header">
          <a href="${backHref}" class="c_site-header__back" aria-label="戻る">←</a>
          <div class="c_site-header__body">
            <h1 class="c_site-header__title">${title}</h1>
            ${subtitle ? `<p class="c_site-header__subtitle">${subtitle}</p>` : ''}
          </div>
          <span aria-hidden="true"></span>
        </header>
      `;
      return;
    }

    this.innerHTML = `
      <header class="c_site-header">
      <span aria-hidden="true"></span>
        <div class="c_site-header__body">
          <h1 class="c_site-header__title">${title}</h1>
          ${subtitle ? `<p class="c_site-header__subtitle">${subtitle}</p>` : ''}
        </div>
        <span aria-hidden="true"></span>
      </header>
    `;
  }
}

customElements.define('app-header', AppHeader);
