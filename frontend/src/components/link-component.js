import { goTo } from '@/router';

class LinkComponent extends HTMLElement {
  constructor() {
    super();
    this.selected = false;
    this.shadow = this.attachShadow({ mode: 'open' });
    const template = document.querySelector('#link-component-template');
    const content = template.content.cloneNode(true);
    this.shadow.appendChild(content);
  }

  connectedCallback() {
    const href = this.getAttribute('href');
    const link = this.shadow.querySelector('a');
    link.setAttribute('href', href);
    link.addEventListener('click', this.#handleClick);
  }

  static get observedAttributes() {
    return ['selected'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'selected') {
      this.#updateStyle(JSON.parse(newValue));
    }
  }

  #updateStyle(selected) {
    if (!selected) return;

    this.selected = true;

    const style = this.shadow.querySelector('style');
    style.textContent = `
      a {
        padding: 5px;
        margin: 5px 5px 5px 0;
        background-color: #ddd;
        text-decoration: none;
        color: #ccc;
        background-color: #333;
        cursor: default;
      }
    `;
  }

  #handleClick(event) {
    event.preventDefault();

    if (!this.selected) {
      const propagationElements = event.composedPath();
      const target = propagationElements.find((elem) =>
        elem.getAttribute('href')
      );
      const { pathname: path } = new URL(target.href);
      goTo(path);
    }
  }
}

customElements.define('nav-link', LinkComponent);
