class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
          &copy; 2026 Chapdaddy 無責任レシピ
      </footer>
    `;
  }
}
customElements.define('app-footer', AppFooter);
