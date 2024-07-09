import { appUtils } from '@/common';

class UserAvatar extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    const template = document.querySelector('#user-avatar-template');
    const content = template.content.cloneNode(true);
    this.shadow.appendChild(content);
  }

  connectedCallback() {
    this.#setSize();
    this.#setContent();
  }

  static get observedAttributes() {
    return ['user-name', 'small'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'user-name') {
      this.#setContent();
    }
    if (name === 'small') {
      this.#setSize();
    }
  }

  #setSize() {
    const avatar = this.shadow.querySelector('.user-avatar');
    const small = this.getAttribute('small');

    if (small) {
      avatar.setAttribute('class', 'user-avatar small');
    } else {
      avatar.setAttribute('class', 'user-avatar');
    }
  }

  #setContent() {
    const avatar = this.shadow.querySelector('.user-avatar');
    const text = this.shadow.querySelector('.user-avatar__text');

    const userName = this.getAttribute('user-name');

    if (userName) {
      const bgColor = appUtils.colorForString(userName);
      const textColor = appUtils.invertColor(bgColor);
      avatar.style.backgroundColor = bgColor;
      avatar.style.color = textColor;
      text.textContent = appUtils.getUserInitials(userName);
    }
  }
}

customElements.define('user-avatar', UserAvatar);
