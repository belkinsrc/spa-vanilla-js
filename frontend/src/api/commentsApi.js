import baseApi from './baseApi';

export const getCommentsByPost = (postId, page) => {
  return baseApi.get(
    `/api/posts/${postId}/comments?_page=${page}&_limit=10&_expand=user&_sort=createAt`
  );
};

export const getCommentsByUser = (userId, page) => {
  return baseApi.get(
    `/api/users/${userId}/comments?_page=${page}&_limit=10&_expand=user,post`
  );
};

export default {
  getCommentsByPost,
  getCommentsByUser,
};
