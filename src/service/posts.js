const posts = new Map();

export const getPost = (id) => {
  return posts.get(id);
};

export const setPost = (post) => {
  post.set(post.id, post);
};

export default {
  getPost,
  setPost,
};
