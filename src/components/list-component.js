import { appConstants } from '@/common';
import { cachePosts, cacheUsers, cacheComments } from '@/service';
import { postsApi, usersApi, commentsApi } from '@/api';

class ListComponent extends HTMLElement {
  constructor() {
    super();
    this.search = '';
    this.page = 1;
    this.lastPage = false;
    this.typeList = appConstants.lists.types.post;

    const shadow = this.attachShadow({ mode: 'open' });
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'list-block');

    const title = document.createElement('h2');
    title.setAttribute('class', 'list-title');
    shadow.appendChild(title);

    //pagination
    const pagination = document.createElement('pagination-component');
    pagination.setAttribute('class', 'list-pagination');
    pagination.setAttribute('page', this.page);
    pagination.setAttribute('last', this.lastPage);

    pagination.addEventListener('paginate-back', (e) => {
      e.stopPropagation();
      if (this.page > 1) {
        this.page = this.page - 1;
        if (this.typeList === appConstants.lists.types.post) {
          this.getPostsPage();
        }
        if (this.typeList === appConstants.lists.types.user) {
          this.getUsersPage();
        }
        if (this.typeList === appConstants.lists.types.comment) {
          this.getCommentsPage();
        }
      }
    });

    pagination.addEventListener('paginate-next', (e) => {
      e.stopPropagation();
      if (!this.lastPage) {
        this.page = this.page + 1;
        if (this.typeList === appConstants.lists.types.post) {
          this.getPostsPage();
        }
        if (this.typeList === appConstants.lists.types.user) {
          this.getUsersPage();
        }
        if (this.typeList === appConstants.lists.types.comment) {
          this.getCommentsPage();
        }
      }
    });
    shadow.appendChild(pagination);

    const style = document.createElement('style');

    style.textContent = `
           
           .list-block{
               display: flex;
               align-items: flex-start;
               justify-content: center;
               flex-wrap: wrap;
               padding: 5px;
           }

           .list-title{
               text-align: center;
           }

           .list-pagination{
            display: flex;
            justify-content: center;
           }

        `;

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
  }

  connectedCallback() {
    this.updateComponent();
  }

  static get observedAttributes() {
    return ['search'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.updateComponent();
  }

  updateComponent() {
    const shadow = this.shadowRoot;
    const userId = this.getAttribute('user');
    const search = this.getAttribute('search');
    const typeList = this.getAttribute('list-type');

    if (search) {
      this.search = search;
    }

    if (typeList) {
      this.typeList = typeList;
    }

    const title = shadow.querySelector('.list-title');

    if (this.typeList === appConstants.lists.types.post) {
      this.getPostsPage();
    }
    if (this.typeList === appConstants.lists.types.user) {
      this.getUsersPage();
    }
    if (this.typeList === appConstants.lists.types.comment) {
      this.getCommentsPage();
    }
  }

  getPostsPage() {
    const shadow = this.shadowRoot;
    const userId = this.getAttribute('user');
    const wrapper = shadow.querySelector('.list-block');
    const pagination = shadow.querySelector('pagination-component');
    pagination.setAttribute('page', this.page);
    pagination.setAttribute('last', this.lastPage);

    const title = shadow.querySelector('.list-title');
    title.textContent = 'All posts';

    if (userId) {
      title.textContent = "Users' posts";
    }

    const apiCall = this.search
      ? postsApi.getPostsSearch(this.search, this.page)
      : userId
      ? postsApi.getPostsByUser(userId, this.page)
      : postsApi.getPosts(this.page);

    apiCall
      .then((posts) => {
        this.lastPage = posts.length < 10;
        const count = posts.length;
        pagination.setAttribute('last', this.lastPage);
        wrapper.innerHTML = '';
        posts.forEach((post) => {
          cachePosts.setPost(post);
          const postElement = document.createElement('post-component');
          postElement.setAttribute('id', post.id);
          if (this.search) {
            postElement.setAttribute('search', this.search);
          }
          wrapper.appendChild(postElement);
        });
        if (count === 0 && this.page === 1) {
          //no data
          wrapper.innerHTML = '<h3>No posts yet</h3>';
        }
      })
      .catch((error) => console.log(error));
  }

  getUsersPage() {
    const shadow = this.shadowRoot;
    const userId = this.getAttribute('user');
    const wrapper = shadow.querySelector('.list-block');
    const pagination = shadow.querySelector('pagination-component');
    pagination.setAttribute('page', this.page);
    pagination.setAttribute('last', this.lastPage);

    const title = shadow.querySelector('.list-title');
    title.textContent = 'All users';

    const apiCall = this.search
      ? usersApi.getUsersSearch(this.search, this.page)
      : usersApi.getUsers(this.page);

    apiCall
      .then((users) => {
        this.lastPage = users.length < 10;
        pagination.setAttribute('last', this.lastPage);
        wrapper.innerHTML = '';
        users.forEach((user) => {
          cacheUsers.setUser(user);
          const userElement = document.createElement('user-component');
          userElement.setAttribute('id', user.id);
          if (this.search) {
            userElement.setAttribute('search', this.search);
          }
          wrapper.appendChild(userElement);
        });
      })
      .catch((error) => console.log(error));
  }

  getCommentsPage() {
    const shadow = this.shadowRoot;
    const userId = this.getAttribute('user');
    const postId = this.getAttribute('post');
    const wrapper = shadow.querySelector('.list-block');
    const pagination = shadow.querySelector('pagination-component');
    const title = shadow.querySelector('.list-title');

    title.textContent = 'All comments';
    if (userId) {
      title.textContent = "User's comments";
    }
    if (postId) {
      title.textContent = "Post's comments";
    }

    pagination.setAttribute('page', this.page);
    pagination.setAttribute('last', this.lastPage);

    const apiCall = this.search
      ? commentsApi.getCommentsSearch(this.search, this.page)
      : userId
      ? commentsApi.getCommentsByUser(userId, this.page)
      : postId
      ? commentsApi.getCommentsByPost(postId, this.page)
      : null;

    if (apiCall) {
      apiCall
        .then((comments) => {
          const count = comments.length;
          this.lastPage = count < 10;
          pagination.setAttribute('last', this.lastPage);
          wrapper.innerHTML = '';
          comments.forEach((comment) => {
            cacheComments.setComment(comment);
            const commentElement = document.createElement('comment-component');
            commentElement.setAttribute('id', comment.id);
            if (this.search) {
              commentElement.setAttribute('search', this.search);
            }
            if (userId) {
              commentElement.setAttribute('post-btn', 'true');
            }
            wrapper.appendChild(commentElement);
          });
          if (count === 0 && this.page === 1) {
            //no data
            wrapper.innerHTML = '<h3>No comments yet</h3>';
          }
        })
        .catch((error) => console.log(error));
    }
  }
}

customElements.define('list-component', ListComponent);
