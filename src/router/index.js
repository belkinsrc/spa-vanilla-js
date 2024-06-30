import { appConstants } from '@/common';
import Route from 'route-parser';

import MainPage from '@/pages/main.template';
import PostsPage from '@/pages/posts.template';
import UsersPage from '@/pages/users.template';

export const routes = {
  Main: new Route(appConstants.routes.index),
  Posts: new Route(appConstants.routes.posts),
  PostsSearch: new Route(appConstants.routes.postsSearch),
  Users: new Route(appConstants.routes.users),
};

export const render = (path) => {
  let result = '<h1 class="not-found">Страница не найдена</h1>';

  if (routes.Main.match(path)) {
    result = MainPage();
  } else if (routes.Posts.match(path)) {
    result = PostsPage();
  } else if (routes.PostsSearch.match(path)) {
    result = PostsPage(routes.PostsSearch.match(path));
  } else if (routes.Users.match(path)) {
    result = UsersPage();
  }
  document.getElementById('app').innerHTML = result;
};

export const goTo = (path) => {
  window.history.pushState({ path }, '', path);
  render(path);
};

const initRouter = () => {
  window.addEventListener('popstate', () => {
    render(new URL(window.location.href).pathname);
  });
  document.querySelectorAll('[href^="/"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const { pathname: path } = new URL(e.target.href);
      goTo(path);
    });
  });
  render(new URL(window.location.href).pathname);
};

export default initRouter;
