import baseApi from './baseApi';

export const getPosts = (page) => {
  return baseApi.get(`/api/posts?_page=${page}&_limit=10&_expand=user`);
};

export const getPostsByUser = (userId, page) => {
  return baseApi.get(
    `/api/posts?_userId=${userId}&_page=${page}&_limit=10&_expand=user`
  );
};

export const getPostById = (id) => {
  return baseApi.get(`/api/posts/${id}?_expand=user`)
};

export const getPostsSearch = (search, page) => {
  return baseApi.get(`/api/posts?_q=${search}&_page=${page}&_limit=10&_expand=user`);
};

export default {
  getPosts,
  getPostsByUser,
  getPostById,
  getPostsSearch,
};
