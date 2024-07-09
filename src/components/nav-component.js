import { appConstants } from '@/common';
import { goTo, routes } from '@/router';

class NavComponent extends HTMLElement {
  constructor() {
    super();
    this.searchType = appConstants.search.types.post;
    this.shadow = this.attachShadow({ mode: 'open' });
    const template = document.querySelector('#nav-component-template');
    const content = template.content.cloneNode(true);
    this.shadow.appendChild(content);
  }

  connectedCallback() {
    this.#handleSearchQuery();
    this.#handleModalDialogActions();
    this.#selectCurrentPage();
  }

  static get observedAttributes() {
    return ['search', 'type'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'search') {
      this.updateSearchQuery(newValue);
    }
    if (name === 'type') {
      this.searchType = newValue;
      this.#updateSearchType();
    }
  }

  updateSearchQuery(query) {
    if (!query) return;
    const input = this.shadow.querySelector('.global-search');
    input.value = query;
  }

  #updateSearchType() {
    const input = this.shadow.querySelector('.global-search');
    if (this.searchType === appConstants.search.types.user) {
      input.setAttribute('placeholder', 'Search user...');
    } else {
      input.setAttribute('placeholder', 'Search post...');
    }
  }

  #selectCurrentPage() {
    const { pathname: path } = new URL(window.location.href);

    const linkSlot = this.shadow.querySelector('slot[name=link]');
    const links = linkSlot.assignedElements();
    const currentLink = links.find(
      (link) => link.getAttribute('href') === path
    );
    currentLink?.setAttribute('selected', 'true');
  }

  #handleModalDialogActions() {
    const modalDialog = this.shadow.querySelector('modal-dialog');
    modalDialog.addEventListener('ok-click', (event) => {
      event.stopPropagation();
      modalDialog.setAttribute('open', 'false');
    });
    modalDialog.addEventListener('cancel-click', (event) => {
      event.stopPropagation();
      modalDialog.setAttribute('open', 'false');
    });
  }

  #handleSearchQuery() {
    const search = this.shadow.querySelector('.global-search');

    search.addEventListener('keyup', (event) => {
      event.preventDefault();

      if (event.key === 'Enter') {
        const query = event.target.value;

        if (query.trim().length < 2) {
          const modalDialog = this.shadow.querySelector('modal-dialog');
          modalDialog.setAttribute('open', 'true');
          return;
        }

        if (this.searchType === appConstants.search.types.post) {
          const url = routes.PostsSearch.reverse({ query });
          goTo(url);
        }
        if (this.searchType === appConstants.search.types.user) {
          const url = routes.UsersSearch.reverse({ query });
          goTo(url);
        }
      }
    });
  }
}

customElements.define('main-nav', NavComponent);
