class FakeForm extends HTMLElement {
  constructor() {
    super();
    this.block = '';
    this.shadow = this.attachShadow({ mode: 'open' });
    const template = document.querySelector('#fake-form-template');
    const content = template.content.cloneNode(true);
    this.shadow.appendChild(content);
  }

  connectedCallback() {
    this.#setTitle();
    this.#handleFormButtonsActions();
    this.#handleModalDialogActions();
  }

  static get observedAttributes() {
    return ['block'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'block') {
      this.block = newValue;
    }
  }

  #setTitle() {
    const title = this.shadow.querySelector('.form__title');
    title.textContent = `Form ${this.block}`;
  }

  #handleFormButtonsActions() {
    const form = this.shadow.querySelector('.form__content');

    const okClick = (event) => {
      const renderData = {
        title: 'Information',
        status: 'Ok',
        dialogType: 'info',
      };
      this.#renderModalDialog(event, renderData);
    };

    const cancelClick = (event) => {
      const renderData = {
        title: 'Warning',
        status: 'Cancel',
        dialogType: 'warning',
      };
      this.#renderModalDialog(event, renderData);
    };

    const actions = {
      ok: okClick,
      cancel: cancelClick,
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const submitter = event.submitter;
      const action = submitter.dataset.action;
      if (action && actions[action]) {
        actions[action](event);
      }
    });
  }

  #handleModalDialogActions() {
    const modalDialog = this.shadow.querySelector('modal-dialog');

    modalDialog.addEventListener('ok-click', (event) => {
      event.stopPropagation();
      alert('It was "Ok" button');
      modalDialog.setAttribute('open', 'false');
    });

    modalDialog.addEventListener('cancel-click', (event) => {
      event.stopPropagation();
      alert('It was "Cancel" button');
      modalDialog.setAttribute('open', 'false');
    });
  }

  #renderModalDialog(event, renderData) {
    const { title, status, dialogType } = renderData;
    const inputText = event.target.elements.text;
    const inputPassword = event.target.elements.password;
    const modalDialog = this.shadow.querySelector('modal-dialog');
    modalDialog.innerHTML = `
      <div slot="title">${title}</div>
      <div slot="message">
      <div>${status}</div>
        <div>Form ${this.block}</div>
        <div>Intut text: ${inputText.value}</div>
        <div>Input password: ${inputPassword.value}</div>
      </div>
      `;
    modalDialog.setAttribute('type', `${dialogType}`);
    modalDialog.setAttribute('open', 'true');
  }
}

customElements.define('fake-form', FakeForm);
