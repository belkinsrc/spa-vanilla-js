import appConstants from '@/common';
import { goTo } from '@/router';

class NavComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'main-nav');

    this.searchType = appConstants.search.types.post;
    this.links = [
      { href: appConstants.routes.index, name: 'Home', class: 'home-link' },
      { href: appConstants.routes.posts, name: 'Posts', class: 'home-link' },
      { href: appConstants.routes.users, name: 'Users', class: 'home-link' },
    ];

    const style = document.createElement('style');
    style.textContent = `
      .main-nav {
        display: flex;
        align-items: center;
        padding: 5px;
      }

      .global-search {
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 4px 20px;
        width: 100%;
        margin: 0 50px;
      }

      .global-search:placeholder {
        color: #aaa;
      }
    `;
    shadow.appendChild(style);
    shadow.appendChild(wrapper);

    this.links.forEach((link) => {
      const linkElement = document.createElement('nav-link');
      linkElement.setAttribute('class', `main-link ${link.class}`);
      linkElement.setAttribute('href', link.href);
      linkElement.setAttribute('text', link.name);
      wrapper.appendChild(linkElement);
    });

    const search = document.createElement('input');
    search.setAttribute('class', 'global-search');
    search.addEventListener('keyup', (e) => {
      e.stopPropagation();

      if (e.key === 'Enter') {
        e.preventDefault();
        const text = e.target.value;
        console.log('search', text);
      }
    });
    wrapper.appendChild(search);
  }

  updateSearch() {
    const shadow = this.shadowRoot;
    const input = shadow.querySelector('input');
    const search = this.getAttribute('search');
    input.value = search;

    if (this.searchType === appConstants.search.types.post) {
      input.setAttribute('placeholder', 'Search post...');
    } else if (this.searchType === appConstants.search.types.users) {
      input.setAttribute('placeholder', 'Search user...');
    }
  }

  connectedCallback() {
    const shadow = this.shadowRoot;
    const searchText = this.getAttribute('search');
    this.searchType = this.getAttribute('type')
      ? this.getAttribute('type')
      : appConstants.search.types.post;

      if (searchText) {
        const input = shadow.querySelector('.global-search');
        input.value = searchText;
      }

      const { pathname: path } = new URL(window.location.href);
      const currentLink = this.links.find((link) => link.href === path);

      if (currentLink) {
        const currentLinkElement = shadow.querySelector(`.${currentLink.class}`);
        currentLinkElement.setAttribute('selected', 'true');
      }
  }

  static get observedAttributes() {
    return ['search', 'type'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'search' || name === 'type') {
      this.updateSearch();
    }
  }
}

customElements.define('main-nav', NavComponent);
