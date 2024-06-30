import { appConstants } from '@/common';
import { goTo, routes } from '../router';

class NavComponent extends HTMLElement {
  constructor() {
    super();

    this.searchType = appConstants.search.types.post;

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
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
      </style>
      <div class="main-nav">
        <slot></slot>
        <input type="text" class="global-search" />
      </div>
    `;
  }

  connectedCallback() {
    const shadow = this.shadowRoot;

    const searchInput = shadow.querySelector('.global-search');
    const searchText = this.getAttribute('search');
    this.searchType = this.getAttribute('type')
      ? this.getAttribute('type')
      : appConstants.search.types.post;
    if (searchText) {
      searchInput.value = searchText;
    }

    searchInput.addEventListener('keyup', (e) => {
      e.stopPropagation();

      if (e.key === 'Enter') {
        e.preventDefault();
        const text = e.target.value;
        if (text.trim()) {
          if (this.searchType === appConstants.search.types.post) {
            const url = routes.PostsSearch.reverse({ query: text });
            goTo(url);
          } else if (this.searchType === appConstants.search.types.user) {
            const url = routes.UsersSearch.reverse({ query: text });
            goTo(url);
          }
        }
      }
    });

    const { pathname } = new URL(window.location.href);
    const path = this.getPathOfCurrentPage(pathname);
    const slot = shadow.querySelector('slot');
    const elementsInsideSlots = slot.assignedElements();
    const currentLinkElement = elementsInsideSlots.find(
      (link) => link.getAttribute('href') === path
    );
    currentLinkElement.setAttribute('selected', 'true');
  }

  static get observedAttributes() {
    return ['search', 'type'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'search') {
      this.updateSearch();
    }
    if (name === 'type') {
      this.searchType = newValue;
      this.updateSearch();
    }
  }

  updateSearch() {
    const shadow = this.shadowRoot;
    const input = shadow.querySelector('input');
    const searchText = this.getAttribute('search');
    input.value = searchText;

    if (this.searchType === appConstants.search.types.post) {
      input.setAttribute('placeholder', 'Search post...');
    } else if (this.searchType === appConstants.search.types.user) {
      input.setAttribute('placeholder', 'Search user...');
    }
  }

  getPathOfCurrentPage(path) {
    const partialsPath = path.split('/').find((partial) => partial);
    return partialsPath ? `/${partialsPath}` : '/';
  }
}

customElements.define('main-nav', NavComponent);
