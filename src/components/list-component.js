import { appConstants } from '@/common';
import { cachePosts } from '@/service';
import { cacheUsers } from '@/service';
import { postsApi } from '@/api';
import { usersApi } from '@/api';

class ListComponent extends HTMLElement {
  constructor() {
    super();

    this.page = 1;
    this.search = '';
    this.lastPage = false;
    this.typeList = appConstants.lists.types.post;
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        .content-list {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          flex-wrap: wrap;
          padding: 5px;
        }
        .section-title {
          text-align: center;
        }
        .pagination {
          display: flex;
          justify-content: center;
        }
      </style>
      <h1 class="section-title"></h1>
      <pagination-component class="pagination"></pagination-component>
      <div class="content-list"></div>
    `;
  }

  connectedCallback() {
    const shadow = this.shadowRoot;

    const paginationElement = shadow.querySelector('pagination-component');
    paginationElement.setAttribute('page', this.page);
    paginationElement.setAttribute('last', this.lastPage);

    paginationElement.addEventListener('paginate-back', (e) => {
      e.stopPropagation();

      if (this.page > 1) {
        this.page = this.page - 1;

        if (this.typeList === appConstants.lists.types.post) {
          this.getPostsPage();
        } else if (this.typeList === appConstants.lists.types.user) {
          this.getUsersPage();
        }
      }
    });

    paginationElement.addEventListener('paginate-forward', (e) => {
      e.stopPropagation();

      if (!this.lastPage) {
        this.page = this.page + 1;

        if (this.typeList === appConstants.lists.types.post) {
          this.getPostsPage();
        } else if (this.typeList === appConstants.lists.types.user) {
          this.getUsersPage();
        }
      }
    });
    this.updateComponent();
  }

  updateComponent() {
    const shadow = this.shadowRoot;
    const userId = this.getAttribute('user');
    const search = this.getAttribute('search');
    const title = shadow.querySelector('.section-title');

    if (search) {
      this.search = search;
    }

    if (this.typeList === appConstants.lists.types.post) {
      title.textContent = 'All posts';
      if (userId) {
        title.textContent = 'Users posts';
      }
    } else if (this.typeList === appConstants.lists.types.user) {
      title.textContent = 'All users';
    }

    if (this.typeList === appConstants.lists.types.post) {
      this.getPostsPage();
    } else if (this.typeList === appConstants.lists.types.user) {
      this.getUsersPage();
    }
  }

  static get observedAttributes() {
    return ['search', 'type-list'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'search') {
      this.search = newValue;
      this.updateComponent();
    }
    if (name === 'type-list') {
      this.typeList = newValue;
      this.updateComponent();
    }
  }

  getPostsPage() {
    const shadow = this.shadowRoot;
    const postsContainer = shadow.querySelector('.content-list');
    postsContainer.innerHTML = '';

    const userId = this.getAttribute('user');

    const paginationElement = shadow.querySelector('pagination-component');
    paginationElement.setAttribute('page', this.page);
    paginationElement.setAttribute('last', this.lastPage);

    const apiCall = this.search
      ? postsApi.getPostsSearch(this.search, this.page)
      : userId
      ? postsApi.getPostsByUser(userId, this.page)
      : postsApi.getPosts(this.page);

    apiCall
      .then((posts) => {
        this.lastPage = posts.length < 10;
        posts.forEach((post) => {
          cachePosts.setPost(post);
          const postElement = document.createElement('post-component');
          postElement.setAttribute('id', post.id);
          if (this.search) {
            postElement.setAttribute('search', this.search);
          }
          postsContainer.appendChild(postElement);
        });
      })
      .catch((error) => console.error(error));
  }

  getUsersPage() {
    const shadow = this.shadowRoot;
    const usersContainer = shadow.querySelector('.content-list');
    usersContainer.innerHTML = '';

    const paginationElement = shadow.querySelector('pagination-component');
    paginationElement.setAttribute('page', this.page);
    paginationElement.setAttribute('last', this.lastPage);

    const apiCall = this.search
      ? usersApi.getUsersSearch(this.search, this.page)
      : usersApi.getUsers(this.page);

    apiCall
      .then((users) => {
        this.lastPage = users.length < 10;
        users.forEach((user) => {
          cacheUsers.setUser(user);
          const userElement = document.createElement('user-component');
          userElement.setAttribute('id', user.id);
          if (this.search) {
            userElement.setAttribute('search', this.search);
          }
          usersContainer.appendChild(userElement);
        });
      })
      .catch((error) => console.error(error));
  }
}

customElements.define('list-component', ListComponent);
