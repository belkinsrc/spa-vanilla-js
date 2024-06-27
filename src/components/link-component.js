import { goTo } from '@/router';

class LinkComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        .main-link {
          padding: 5px;
          margin: 5px 5px 5px 0;
          background-color: #ddd;
          color: #333;
        }

        .main-link:hover {
          background-color: #666;
          color: #eee;
          text-decoration: none;
        }
      </style>
      <a class="main-link">
        <slot></slot>
      </a>
    `;
  }

  connectedCallback() {
    const shadow = this.shadowRoot;
    const href = this.getAttribute('href');
    const link = shadow.querySelector('.main-link');
    link.setAttribute('href', href ?? '#');
    link.addEventListener('click', this.handleClick.bind(this));
  }

  static get observedAttributes() {
    return ['selected'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'selected') {
      this.updateStyle(JSON.parse(newValue));
    }
  }

  handleClick(e) {
    e.preventDefault();

    const isSelected = this.getAttribute('selected');
    if (!isSelected) {
      const chainOfParentsOfTargetElement = e.composedPath();
      const targetElement = chainOfParentsOfTargetElement.find((element) =>
        element.classList.contains('main-link')
    );
    const { pathname: path } = new URL(targetElement.href);
    goTo(path);
    }
  }

  updateStyle(isSelected) {
    if (isSelected) {
      const shadow = this.shadowRoot;
      const style = shadow.querySelector('style');
      style.textContent = `
        .main-link {
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
