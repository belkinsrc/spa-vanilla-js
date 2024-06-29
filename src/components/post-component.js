import { appUtils } from '@/common';
import { cache } from '@/service';

class PostComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        .post {
          max-width: 200px;
          border-radius: 10px;
          background-color: #ccc;
          margin: 10px;
          padding: 10px;
        }
        .post .post__title {
          padding: 10px;
          font-weight: bold; 
        }
        .post .post__text {
          padding: 10px;
          font-family: fantasy;
          max-height: 200px;
          overflow: hidden;
          cursor: pointer;
        }
        .user {
          padding: 10px;
          font-family: arial;
          background-color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .user-avatar {
          margin-right: 10px;
        }
        .highlight {
          background-color: yellow;
        }
      </style>
      <div class="post">
        <div class="post__title"></div>
        <div class="post__text"></div>
        <div class="user post__user">
          <user-avatar small="true"></user-avatar>
          <div class="user__name"></div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    const shadow = this.shadowRoot;
    const id = this.getAttribute('id'); // need to check
    const search = this.getAttribute('search'); // need to check
    const post = cache.getPost(id); // need to check

    const titleElement = shadow.querySelector('.post__title');
    titleElement.textContent = post.title;
    const textElement = shadow.querySelector('.post__text');

    if (search) {
      textElement.textContent = appUtils.highlightText(post.text, search);
    } else {
      textElement.textContent = post.text;
    }

    textElement.addEventListener('click', (e) => {
      e.stopPropagation();

      console.log('Click on Text');
    });

    const userElement = shadow.querySelector('.user');
    const userAvatarElement = shadow.querySelector('user-avatar');
    userAvatarElement.setAttribute('user-name', post.user.user_name);
    const userNameElement = shadow.querySelector('.user__name');
    userNameElement.textContent = post.user.user_name;

    userElement.addEventListener('click', (e) => {
      e.stopPropagation();

      console.log('Click on User');
    });
  }
}

customElements.define('post-component', PostComponent);
