import { appUtils } from '@/common';

class UserAvatarComponent extends HTMLElement {
  constructor() {
    super();

    this.selected = false;
    this.small = false;
    this.text = '';
    const shadow = this.attachShadow({ mode: 'open' });
    const bgColor = appUtils.randomColor();
    const textColor = appUtils.invertColor(bgColor);

    shadow.innerHTML = `
      <style>
        .user-avatar {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          width: 40px;
          height: 40px;
          text-transform: uppercase;
          font-family: fixed;
          border-radius: 50%;
          padding: 16px;
          background-color: ${bgColor};
          color: ${textColor};
          margin-right: 5px;
        }
        .user-avatar--small {
          font-size: 10px;
          width: 10px;
          height: 10px;
        }
      </style>
      <div class="user-avatar">
        <div class="user-avatar__text"></div>
      </div>
    `;
  }

  connectedCallback() {
    this.updateComponent();
  }

  static get observedAttributes() {
    return ['user-name', 'small'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'small') {
      this.small = JSON.parse(newValue);
    } else if (name === 'user-name') {
      this.text = newValue;
    }
    this.updateComponent();
  }

  updateComponent() {
    const shadow = this.shadowRoot;
    const avatar = shadow.querySelector('.user-avatar');
    const textContainer = shadow.querySelector('.user-avatar__text');

    if (this.small) {
      avatar.classList.add('user-avatar--small');
    }
    textContainer.textContent = appUtils.getUserInitials(this.text);
  }
}

customElements.define('user-avatar', UserAvatarComponent);
