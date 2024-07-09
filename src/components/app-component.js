class AppComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    const template = document.querySelector('#main-template');
    const content = template.content.cloneNode(true);
    this.shadow.appendChild(content);
  }
}

customElements.define('app-component', AppComponent);
