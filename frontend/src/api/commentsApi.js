import baseApi from './baseApi';

export const getCommentsByPost = (postId, page) => {
  return baseApi.get(
    `/posts/${postId}/comments?_page=${page}&_limit=10&_expand=user&_sort=createAt`
  );
};

export const getCommentsByUser = (userId, page) => {
  return baseApi.get(
    `/users/${userId}/comments?_page=${page}&_limit=10&_expand=user&_expand=post`
  );
};

export default {
  getCommentsByPost,
  getCommentsByUser,
};
