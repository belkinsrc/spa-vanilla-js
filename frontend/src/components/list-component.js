import { appConstants } from '@/common';
import { cachePosts, cacheUsers, cacheComments } from '@/service';
import { postsApi, usersApi, commentsApi } from '@/api';

class ListComponent extends HTMLElement {
  constructor() {
    super();
    this.search = '';
    this.page = 1;
    this.lastPage = false;
    this.typeList = appConstants.lists.types.posts;

    this.shadow = this.attachShadow({ mode: 'open' });
    const template = document.querySelector('#entity-list-template');
    const content = template.content.cloneNode(true);
    this.shadow.appendChild(content);
  }

  connectedCallback() {
    this.#handlePagination();
    this.#fetchEntities();
  }

  static get observedAttributes() {
    return ['search', 'type'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'search') {
      this.#update(newValue);
    }
    if (name === 'type') {
      this.#setType(newValue);
      this.#setTitle();
    }
  }

  #update(query) {
    if (query) {
      this.search = query;
    }
    this.#fetchEntities();
  }

  #handlePagination() {
    const pagination = this.shadow.querySelector('pagination-component');

    pagination.addEventListener('paginate-back', (e) => {
      e.stopPropagation();
      if (this.page > 1) {
        this.page = this.page - 1;
        pagination.setAttribute('page', this.page);
        this.#fetchEntities();
      }
    });

    pagination.addEventListener('paginate-next', (e) => {
      e.stopPropagation();
      if (!this.lastPage) {
        this.page = this.page + 1;
        pagination.setAttribute('page', this.page);
        this.#fetchEntities();
      }
    });
  }

  #setTitle() {
    const title = this.shadow.querySelector('.title');
    switch (this.typeList) {
      case appConstants.lists.types.posts:
        title.textContent = 'All posts';
        break;
      case appConstants.lists.types.users:
        title.textContent = 'All users';
        break;
      case appConstants.lists.types.userPosts:
        title.textContent = 'User posts';
        break;
      case appConstants.lists.types.userComments:
        title.textContent = 'User comments';
        break;
      case appConstants.lists.types.postComments:
        title.textContent = 'Post comments';
        break;
    }
  }

  #setType(value) {
    for (let type in appConstants.lists.types) {
      if (value === type) {
        this.typeList = value;
      }
    }
  }

  async #fetchEntities() {
    const api = this.#getEntitiesApi();

    if (api) {
      try {
        const entities = await api;
        let entityType = '';
        const entityAttributes = {};
        const options = {
          cache: {},
        };

        switch (this.typeList) {
          case appConstants.lists.types.users:
            entityType = 'user-component';
            options.cache.set = cacheUsers.setUser;

            if (this.search) {
              entityAttributes.search = this.search;
            }
            break;
          case appConstants.lists.types.posts:
            entityType = 'post-component';
            options.cache.set = cachePosts.setPost;

            if (this.search) {
              entityAttributes.search = this.search;
            }
            break;
          case appConstants.lists.types.userPosts:
            entityType = 'post-component';
            options.cache.set = cachePosts.setPost;

            if (this.search) {
              entityAttributes.search = this.search;
            }
            break;
          case appConstants.lists.types.userComments:
          case appConstants.lists.types.postComments:
            entityType = 'comment-component';
            options.cache.set = cacheComments.setComment;

            if (this.search) {
              entityAttributes.search = this.search;
            }
            const userId = this.getAttribute('user');
            if (userId) {
              entityAttributes['post-btn'] = 'true';
            }
            break;
        }
        this.#render(entities, entityType, entityAttributes, options);
      } catch (error) {
        console.error(error);
      }
    }
  }

  #render(entities, entityType, entityAttributes, options) {
    const { cache } = options;

    const pagination = this.shadow.querySelector('pagination-component');
    const wrapper = this.shadow.querySelector('.entity-list');
    wrapper.innerHTML = '';

    entities.forEach((entity) => {
      cache.set(entity);

      this.lastPage = entities.length < 10;
      pagination.setAttribute('last', this.lastPage);

      const entityElement = document.createElement(entityType);
      entityElement.setAttribute('id', entity.id);
  
      for (let attribute in entityAttributes) {
        if (entityAttributes.hasOwnProperty(attribute)) {
          entityElement.setAttribute(attribute, entityAttributes[attribute]);
        }
      }
      wrapper.appendChild(entityElement);
    });

    if (entities.length === 0) {
      wrapper.innerHTML = '<h3>No comments yet</h3>';
    }
  }

  #getEntitiesApi() {
    const userId = this.getAttribute('user');
    const postId = this.getAttribute('post');
    const page = this.page;
    const search = this.search;

    switch (this.typeList) {
      case appConstants.lists.types.users:
        return this.#getUsersApi(search, page);
      case appConstants.lists.types.postComments:
      case appConstants.lists.types.userComments:
        return this.#getCommentsApi(search, userId, postId, page);
      default:
        return this.#getPostsApi(search, userId, page);
    }
  }

  #getUsersApi(search, page) {
    return search
      ? usersApi.getUsersSearch(search, page)
      : usersApi.getUsers(page);
  }

  #getPostsApi(search, userId, page) {
    if (search) {
      return postsApi.getPostsSearch(search, page);
    } else if (userId) {
      return postsApi.getPostsByUser(userId, page);
    } else {
      return postsApi.getPosts(page);
    }
  }

  #getCommentsApi(search, userId, postId, page) {
    if (search) {
      return commentsApi.getCommentsSearch(search, page);
    } else if (userId) {
      return commentsApi.getCommentsByUser(userId, page);
    } else if (postId) {
      return commentsApi.getCommentsByPost(postId, page);
    } else {
      return null;
    }
  }
}

customElements.define('list-component', ListComponent);
