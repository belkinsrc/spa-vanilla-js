import { appUtils } from '@/common';

class DateFormatted extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    const template = document.querySelector('#date-formatted-template');
    const content = template.content.cloneNode(true);
    this.shadow.appendChild(content);
  }

  static get observedAttributes() {
    return ['date'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'date') {
      this.#update();
    }
  }

  #update() {
    console.log('sdfsdf');
    const currentDate = this.getAttribute('date');
    const date = this.shadow.querySelector('.date-formatted');
    date.textContent = appUtils.dateFormat(currentDate);
  }
}

customElements.define('date-formatted', DateFormatted);
