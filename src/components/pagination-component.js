class Pagination extends HTMLElement {
  constructor() {
    super();
    this.page = 1;
    this.lastPage = false;
    this.shadow = this.attachShadow({ mode: 'open' });
    const template = document.querySelector('#pagination-component-template');
    const content = template.content.cloneNode(true);
    this.shadow.appendChild(content);
  }

  connectedCallback() {
    this.#update();
    this.#handleClickButtons();
  }

  static get observedAttributes() {
    return ['page', 'last'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'page') {
      this.page = JSON.parse(newValue);
    }
    if (name === 'last') {
      this.lastPage = JSON.parse(newValue);
    }
    this.#update();
  }

  #update() {
    this.#setCurrentPage();
    this.#disableButtons();
  }

  #setCurrentPage() {
    const pageLabel = this.shadow.querySelector('.pagination__label');
    pageLabel.textContent = `Page ${this.page}`;
  }

  #disableButtons() {
    const btnPrev = this.shadow.querySelector('.pagination__btn--prev');
    const btnNext = this.shadow.querySelector('.pagination__btn--next');

    if (this.page === 1) {
      btnPrev.setAttribute('disabled', true);
    } else {
      btnPrev.removeAttribute('disabled');
    }
    if (this.lastPage) {
      btnNext.setAttribute('disabled', true);
    } else {
      btnNext.removeAttribute('disabled');
    }
  }

  #handleClickButtons() {
    const btnPrev = this.shadow.querySelector('.pagination__btn--prev');
    btnPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.page > 1) {
        const event = new CustomEvent('paginate-back');
        this.dispatchEvent(event);
      }
    });

    const btnNext = this.shadow.querySelector('.pagination__btn--next');
    btnNext.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!this.lastPage) {
        const event = new CustomEvent('paginate-next');
        this.dispatchEvent(event);
      }
    });
  }
}

customElements.define('pagination-component', Pagination);
