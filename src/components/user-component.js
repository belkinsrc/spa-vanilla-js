import { appUtils } from '@/common';
import { cacheUsers } from '@/service';
import { usersApi } from '@/api';
import { routes, goTo } from '@/router';

class UserComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style></style>
      <h1 class="title"></h1>
      <div class="user">
        <div class="user__container">
          <div class="avatar">
            <user-avatar></user-avatar>
            <div class="user__title"></div>
          </div>
          <div class="user__text"></div>
          <div class="user__buttons">
              <div class="user__btn user__btn--posts">Posts</div>
              <div class="user__btn user__btn--comments">Comments</div>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    const shadow = this.shadowRoot;
    const id = this.getAttribute('id');
    const single = this.getAttribute('single');
    const user = cacheUsers.getUser(id);

    if (single) {
      const titleElement = shadow.querySelector('.title');
      titleElement.textContent = 'User info';
    }
    this.updateStyle();

    if (user) {
      this.updateUser();
    } else {
      usersApi
        .getUserById(id)
        .then((user) => {
          cacheUsers.setUser(user);
          this.updateUser();
        })
        .catch((error) => console.error(error));
    }

    const userBlock = shadow.querySelector('.user');

    userBlock.addEventListener('click', (e) => {
      e.stopPropagation();
      //goto user page
      const url = routes.User.reverse({ user: id });
      goTo(url);
    });

    const btnPosts = shadow.querySelector('.user__btn--posts');
    btnPosts.addEventListener('click', (e) => {
      e.stopPropagation();
      const url = routes.UserPosts.reverse({ user: id });
      goTo(url);
    });

    const btnComments = shadow.querySelector('.user__btn--comments');
    btnComments.addEventListener('click', (e) => {
      e.stopPropagation();
      const url = routes.UserComments.reverse({ user: id });
      goTo(url);
    });
  }

  updateUser() {
    const shadow = this.shadowRoot;
    const search = this.getAttribute('search');
    const id = this.getAttribute('id');
    const user = cacheUsers.getUser(id);
    const titleElement = shadow.querySelector('.user__title');
    const textElement = shadow.querySelector('.user__text');

    if (search) {
      titleElement.innerHTML = appUtils.highlightText(
        user.user_fullname,
        search
      );
      textElement.innerHTML = appUtils.highlightText(user.user_name, search);
    } else {
      titleElement.textContent = user.user_fullname;
      textElement.textContent = user.user_name;
    }

    const userAvatar = shadow.querySelector('user-avatar');
    userAvatar.setAttribute('user-name', user.user_name);
  }

  updateStyle() {
    const shadow = this.shadowRoot;
    const single = this.getAttribute('single');
    const style = shadow.querySelector('style');

    const customStyle = single
      ? `
          background-color: #fff;
          border: 1px solid #ccc;
        `
      : `
          background-color: #ccc;
        `;

    const customButtonStyle = single
      ? `
          background-color: #fff;
          border: 1px solid #ccc;
        `
      : `
          background-color: #ccc;
        `;

    style.textContent = `
      .user {
        display: flex;
        justify-content: center;
      }
      .avatar {
        display: flex;
      }  
      .title {
        text-align: center;
      }
      .user__container {
        max-width: 200px;
        border-radius: 10px;
        ${customStyle}
        margin: 10px;
        padding: 10px;
      }
      .user__container .user__title {
        padding: 10px;
        font-weight: bold; 
      }
      .user__container .user__text {
        padding: 10px;
        font-family: fantasy;
        max-height: 200px;
        overflow: hidden;
        cursor: pointer;
      }
      .user__container .user__buttons {
        padding: 10px;
        font-family: arial;
        display: flex;
        justify-content: space-around;
        min-width: 200px;
      } 
      .user__container .user__buttons .user__btn {
        padding: 10px;
        ${customButtonStyle}
        color: #666;
        border-radius: 8px;
        cursor: pointer;
      }
      .user__container .user__buttons .user__btn:hover {
        color: #333;
        background-color: #eee;
     }
      .highlight {
        background-color: yellow;
      }
    `;
  }
}

customElements.define('user-component', UserComponent);
