import { goTo, routes } from '@/router';
import { appUtils } from '@/common';
import { cachePosts } from '@/service';

class PostComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    const template = document.querySelector('#post-component-template');
    const content = template.content.cloneNode(true);
    this.shadow.appendChild(content);
  }

  async connectedCallback() {
    const id = this.getAttribute('id');
    const post = cachePosts.getPost(id);

    if (post) {
      this.#update(id, post);
    } else {
      try {
        const post = await postsApi.getPostById(id);
        this.#update(id, post);
        cachePosts.setPost(post);
      } catch (error) {
        console.error(error);
      }
    }
  }

  #update(id, post) {
    this.#setTitle(post);
    this.#setUserAvatar(post);
    this.#setUserName(post);
    this.#highlightText(post);
    this.#handleClick(id, post);
  }

  #highlightText(post) {
    const text = this.shadow.querySelector('.post__text');
    const search = this.getAttribute('search');

    if (search) {
      text.innerHTML = appUtils.highlightText(post.text, search);
    } else {
      text.textContent = post.text;
    }
  }

  #setTitle(post) {
    const title = this.shadow.querySelector('.post__title');
    title.textContent = post.title;
  }

  #handleClick(id, post) {
    const user = this.shadow.querySelector('.user');
    const text = this.shadow.querySelector('.post__text');

    text.addEventListener('click', (event) => {
      event.stopPropagation();
      const url = routes.Post.reverse({ post: id });
      goTo(url);
    });

    user.addEventListener('click', (event) => {
      event.stopPropagation();
      const url = routes.User.reverse({ user: post.user.id });
      goTo(url);
    });
  }

  #setUserAvatar(post) {
    const userAvatar = this.shadow.querySelector('user-avatar');
    userAvatar.setAttribute('user-name', post.user.user_name);
  }

  #setUserName(post) {
    const userName = this.shadow.querySelector('.user__name');
    userName.textContent = post.user.user_fullname;
  }
}

customElements.define('post-component', PostComponent);
