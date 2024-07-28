const posts = new Map();

export const getPost = (id) => {
  return posts.get(id);
};

export const setPost = (post) => {
  posts.set(post.id, post);
};

export default {
  getPost,
  setPost,
};
