class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
          &copy; Chapdaddy 無責任レシピ
      </footer>
    `;
  }
}
customElements.define('app-footer', AppFooter);
