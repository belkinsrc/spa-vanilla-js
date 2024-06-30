const users = new Map();

export const getUser = (id) => {
  return users.get(id);
};

export const setUser = (user) => {
  users.set(user.id, user);
};

export default {
  getUser,
  setUser,
};