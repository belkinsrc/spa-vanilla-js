class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.open = false;
    this.type = 'error';
    this.shadow = this.attachShadow({ mode: 'open' });
    const template = document.querySelector('#modal-dialog-template');
    const content = template.content.cloneNode(true);
    this.shadow.appendChild(content);
  }

  connectedCallback() {
    this.#handleActions();
  }

  static get observedAttributes() {
    return ['open', 'type'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'type') {
      this.type = newValue;
    }
    if (name === 'open') {
      this.open = JSON.parse(newValue);
      this.#update();
    }
  }

  #update() {
    const dialogWrapper = this.shadow.querySelector('.modal-dialog__wrapper');
    dialogWrapper.classList.add(this.type);

    if (this.type !== 'error') {
      const cancelButton = this.shadow.querySelector(
        '.modal-dialog__btn--cancel-btn'
      );
      cancelButton.classList.remove('hide');
    }
    this.#toggleVisibility();
  }

  #toggleVisibility() {
    const dialog = this.shadow.querySelector('.modal-dialog');
    if (this.open) {
      dialog.classList.add('open');
    } else {
      dialog.classList.remove('open');
    }
  }

  #handleActions() {
    const dialog = this.shadow.querySelector('.modal-dialog__wrapper');

    const okClick = () => {
      const event = new CustomEvent('ok-click');
      this.dispatchEvent(event);
    };

    const cancelClick = () => {
      const event = new CustomEvent('cancel-click');
      this.dispatchEvent(event);
    };

    const actions = {
      ok: okClick,
      cancel: cancelClick,
    };

    dialog.addEventListener('click', (event) => {
      const target = event.target;
      const action = target.dataset.action;
      if (action && actions[action]) {
        actions[action]();
      }
    });
  }
}

customElements.define('modal-dialog', ModalDialog);
