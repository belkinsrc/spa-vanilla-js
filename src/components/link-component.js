import { goTo } from '@/router';

class LinkComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const link = document.createElement('a');
    const style = document.createElement('style');
    this.selected = false;

    style.textContent = `
      a {
        padding: 5px;
        margin: 5px 5px 5px 0;
        text-decoration: none;
        background-color: #ddd;
        color: #333;
      }

      a:hover {
        background-color: #666;
        color: #eee;
        text-decoration: none;
      }
    `;
    shadow.appendChild(style);
    shadow.appendChild(link);
  }

  connectedCallback() {
    const shadow = this.shadowRoot;
    const href = this.getAttribute('href');
    const text = this.getAttribute('text');
    const link = shadow.querySelector('a');
    link.textContent = text;
    link.setAttribute('href', href);
    link.addEventListener('click', this.handleClick);
  }

  handleClick(e) {
    e.preventDefault();

    if (!this.selected) {
      const { pathname: path } = new URL(e.target.href);
      goTo(path);
      this.selected = true;
      this.setAttribute('selected', this.selected);
    }
  }

  static get observedAttributes() {
    return ['selected'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'selected') {
      this.updateStyle(JSON.parse(newValue));
    }
  }

  updateStyle(isSelected) {
    if (isSelected) {
      const shadow = this.shadowRoot;
      const style = shadow.querySelector('style'); 
      style.textContent = `
        a {
          padding: 5px;
          margin: 5px 5px 5px 0;
          text-decoration: none;
          background-color: #333;
          color: #ccc;
          cursor: default;
        }
      `;
    }
  }
}

customElements.define('nav-link', LinkComponent);
