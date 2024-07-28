import { routes, goTo } from '@/router';
import { cacheComments } from '@/service';

class CommentComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    const template = document.querySelector('#comment-component-template');
    const content = template.content.cloneNode(true);
    this.shadow.appendChild(content);
  }

  connectedCallback() {
    const id = this.getAttribute('id');
    const comment = cacheComments.getComment(id);

    this.#setText(comment);
    this.#setDate(comment);
    this.#setUserAvatar(comment);
    this.#setUserName(comment);
    this.#handleClick(comment);

    const showPostButton = this.getAttribute('post-btn');
    if (showPostButton) {
      this.#createPostBtn(comment);
    }
  }

  #setText(comment) {
    const text = this.shadow.querySelector('.comment__text');
    text.textContent = comment.text;
  }

  #setDate(comment) {
    const commentDate = this.shadow.querySelector('date-formatted');
    commentDate.setAttribute('date', comment.createdAt);
  }

  #setUserAvatar(comment) {
    const userAvatar = this.shadow.querySelector('user-avatar');
    userAvatar.setAttribute('user-name', comment.user.user_name);
  }

  #setUserName(comment) {
    const userName = this.shadow.querySelector('.user__name');
    userName.textContent = comment.user.user_fullname;
  }

  #handleClick(comment) {
    const user = this.shadow.querySelector('.user');
    user.addEventListener('click', (event) => {
      event.stopPropagation();
      const url = routes.User.reverse({ user: comment.user.id });
      goTo(url);
    });
  }

  #createPostBtn(comment) {
    const postButton = document.createElement('button');
    postButton.setAttribute('class', 'post-button');
    postButton.textContent = 'Open post';

    const bottomBlock = this.shadow.querySelector('.comment__bottom');
    bottomBlock.appendChild(postButton);

    postButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const url = routes.Post.reverse({ post: comment.post.id });
      goTo(url);
    });
  }
}

customElements.define('comment-component', CommentComponent);
