class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="c_site-header">
        <nav class="c_site-header__nav" aria-label="サイトナビ">
          <a class="c_site-header__home" href="index.html" aria-label="ホーム">
            <span class="material-symbols-outlined" aria-hidden="true">home</span>
          </a>
          <a class="c_site-header__mood" href="list.html">
            <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            <span>気分で選ぶ</span>
          </a>
        </nav>
        <p class="c_site-header__lead">考えすぎない男飯</p>
        <p class="c_site-header__brand">無責任レシピ</p>
      </header>
    `;
  }
}

customElements.define('app-header', AppHeader);
