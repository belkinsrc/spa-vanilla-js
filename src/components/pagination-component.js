class PaginationComponent extends HTMLElement {
  constructor() {
    super();

    this.page = 1;
    this.lastPage = false;

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        .posts-pagination {
          display: flex;
          justify-content: center;

        }
        .posts-pagination__label {
          margin: 0 10px;
          font-weight: bold;
          font-family: system-ui;
        }
      </style>
      <div class="posts-pagination">
        <button class="btn posts-pagination__prev-btn" data-btn-prev>< Prev</button>
        <div class="posts-pagination__label">Page ${this.page}</div>
        <button class="btn posts-pagination__next-btn" data-btn-next>Next ></button>
      </div>
    `;
  }

  connectedCallback() {
    const shadow = this.shadowRoot;
    const btnPrev = shadow.querySelector('[data-btn-prev]');
    const btnNext = shadow.querySelector('[data-btn-next]');

    btnPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (this.page > 1) {
        const paginateBackEvent = new CustomEvent('paginate-back');
        this.dispatchEvent(paginateBackEvent);
      }
    });

    btnNext.addEventListener('click', (e) => {
      e.stopPropagation();

      if (!this.lastPage) {
        const paginateForwardEvent = new CustomEvent('paginate-forward');
        this.dispatchEvent(paginateForwardEvent);
      }
    });

    this.updateComponent();
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
    this.updateComponent();
  }

  updateComponent() {
    const shadow = this.shadowRoot;
    const btnPrev = shadow.querySelector('[data-btn-prev]');
    const btnNext = shadow.querySelector('[data-btn-next]');
    const pageLabel = shadow.querySelector('.posts-pagination__label');

    pageLabel.textContent = `Page ${this.page}`;

    if (this.page <= 1) {
      btnPrev.setAttribute('disabled', 'true');
    } else {
      btnPrev.removeAttribute('disabled');
    }

    if (this.lastPage) {
      btnNext.setAttribute('disabled', 'true');
    } else {
      btnNext.removeAttribute('disabled');
    }
  }
}

customElements.define('pagination-component', PaginationComponent);
