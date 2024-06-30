import { cache } from '@/service';
import { postsApi } from '@/api';

class PostsComponent extends HTMLElement {
  constructor() {
    super();

    this.page = 1;
    this.search = '';
    this.lastPage = false;
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        .posts {
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
      <div class="posts"></div>
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
        this.getPostsPage();
      }
    });

    paginationElement.addEventListener('paginate-forward', (e) => {
      e.stopPropagation();

      if (!this.lastPage) {
        this.page = this.page + 1;
        this.getPostsPage();
      }
    });

    this.updateComponent();
  }

  updateComponent() {
    const shadow = this.shadowRoot;
    const userId = this.getAttribute('user');
    const search = this.getAttribute('search');
    const title = shadow.querySelector('.section-title');
    title.textContent = 'All posts';
    if (userId) {
      title.textContent = 'Users posts';
    }
    if (search) {
      this.search = search;
    }
    this.getPostsPage();
  }

  static get observedAttributes() {
    return ['search'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'search') {
      this.search = newValue;
      this.getPostsPage();
    }
  }

  getPostsPage() {
    const shadow = this.shadowRoot;
    const postsContainer = shadow.querySelector('.posts');
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
          cache.setPost(post);
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
}

customElements.define('posts-component', PostsComponent);
