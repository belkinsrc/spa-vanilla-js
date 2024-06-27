import appConstants from '@/common';

class NavComponent extends HTMLElement {
  constructor() {
    super();

    this.searchType = appConstants.search.types.post;
    this.links = [
      { href: appConstants.routes.index },
      { href: appConstants.routes.posts },
      { href: appConstants.routes.users },
    ];

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

    const searchInput = shadow.querySelector('.global-search');
    searchInput.addEventListener('keyup', (e) => {
      e.stopPropagation();

      if (e.key === 'Enter') {
        e.preventDefault();
        const text = e.target.value;
        console.log('search', text);
      }
    });

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

  attributeChangedCallback(name) {
    if (name === 'search' || name === 'type') {
      this.updateSearch();
    }
  }
}

customElements.define('main-nav', NavComponent);
