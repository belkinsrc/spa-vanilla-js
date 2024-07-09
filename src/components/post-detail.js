import { routes, goTo } from '@/router';
import { postsApi } from '@/api';
import { cachePosts } from '@/service';

class PostDetail extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    const template = document.querySelector('#post-detail-template');
    const content = template.content.cloneNode(true);
    this.shadow.appendChild(content);
  }

  async connectedCallback() {
    const id = this.getAttribute('post');
    const post = cachePosts.getPost(id);

    if (post) {
      this.#update(post);
    } else {
      try {
        const post = await postsApi.getPostById(id);
        this.#update(post);
        cachePosts.setPost(post);
      } catch (error) {
        console.error(error);
      }
    }
  }

  #update(post) {
    this.#setTitle(post);
    this.#setText(post);
    this.#setUserAvatar(post);
    this.#setUserName(post);
    this.#setDate(post);
    this.#handleClick(post);
  }

  #setTitle(post) {
    const title = this.shadow.querySelector('.post-detail__title');
    title.textContent = post.title;
  }

  #setText(post) {
    const text = this.shadow.querySelector('.post-detail__text');
    text.textContent = post.text;
  }

  #setUserAvatar(post) {
    const userAvatar = this.shadow.querySelector('user-avatar');
    userAvatar.setAttribute('user-name', post.user.user_name);
  }

  #setUserName(post) {
    const userName = this.shadow.querySelector('.user__name');
    userName.textContent = post.user.user_fullname;
  }

  #setDate(post) {
    const postDate = this.shadow.querySelector('date-formatted');
    postDate.setAttribute('date', post.createdAt);
  }

  #handleClick(post) {
    const user = this.shadow.querySelector('.user');
    user.addEventListener('click', (event) => {
      event.stopPropagation();
      const url = routes.User.reverse({ user: post.user.id });
      goTo(url);
    });
  }
}

customElements.define('post-detail', PostDetail);
