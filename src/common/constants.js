const appConstants = {
  routes: {
    index: '/',
    posts: '/posts',
    postsSearch: '/posts/query/:query',
    users: '/users',
    usersSearch: '/users/query/:query',
  },
  search: {
    types: {
      post: 'post',
      user: 'user',
    },
  },
  lists: {
    types: {
      post: 'post',
      user: 'user',
    },
  },
};

export default appConstants;
