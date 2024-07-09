import { goTo, routes } from '@/router';
import { appUtils } from '@/common';
import { cacheUsers } from '@/service';
import { usersApi } from '@/api';

class UserComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    const template = document.querySelector('#user-component-template');
    const content = template.content.cloneNode(true);
    this.shadow.appendChild(content);
  }

  async connectedCallback() {
    const id = this.getAttribute('id');
    const user = cacheUsers.getUser(id);

    if (user) {
      this.#update(id, user);
    } else {
      try {
        const user = await usersApi.getUserById(id);
        cacheUsers.setUser(user);
        this.#update(id, user);
      } catch (error) {
        console.error(error);
      }
    }
  }

  #update(id, user) {
    this.#setTitle();
    this.#setAvatar(user);
    this.#updateStyle();
    this.#highlightText(user);
    this.#handleClick(id);
  }

  #updateStyle() {
    const single = this.getAttribute('single');
    if (single) {
      const wrapper = this.shadow.querySelector('.user__wrapper');
      wrapper.style.backgroundColor = '#fff';
      wrapper.style.border = '1px solid #ccc';

      const buttons = this.shadow.querySelectorAll('.user__btn');
      buttons.forEach((btn) => {
        btn.style.backgroundColor = '#fff';
        btn.style.border = '1px solid #ccc';
      });
    }
  }

  #setTitle() {
    const single = this.getAttribute('single');

    if (single) {
      const title = this.shadow.querySelector('.title');
      title.textContent = 'User info';
    }
  }

  #setAvatar(user) {
    const userAvatar = this.shadow.querySelector('user-avatar');
    const single = this.getAttribute('single');

    if (!single) {
      userAvatar.setAttribute('small', 'true');
    }
    userAvatar.setAttribute('user-name', user.user_name);
  }

  #highlightText(user) {
    const search = this.getAttribute('search');
    const title = this.shadow.querySelector('.user__title');
    const text = this.shadow.querySelector('.user__text');

    if (search) {
      title.innerHTML = appUtils.highlightText(user.user_fullname, search);
      text.innerHTML = appUtils.highlightText(user.user_name, search);
    } else {
      title.textContent = user.user_fullname;
      text.textContent = user.user_name;
    }
  }

  #handleClick(id) {
    const userBlock = this.shadow.querySelector('.user');
    userBlock.addEventListener('click', (event) => {
      event.stopPropagation();
      const url = routes.User.reverse({ user: id });
      goTo(url);
    });

    const btnPosts = this.shadow.querySelector('.user__btn--posts');
    btnPosts.addEventListener('click', (event) => {
      event.stopPropagation();
      const url = routes.UserPosts.reverse({ user: id });
      goTo(url);
    });

    const btnComments = this.shadow.querySelector('.user__btn--comments');
    btnComments.addEventListener('click', (event) => {
      event.stopPropagation();
      const url = routes.UserComments.reverse({ user: id });
      goTo(url);
    });
  }
}

customElements.define('user-component', UserComponent);
