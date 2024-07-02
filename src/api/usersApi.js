import baseApi from './baseApi';

export const getUsers = (page) => {
  return baseApi.get(`/users?_page=${page}&_limit=10`);
};

export const getUserById = (id) => {
  return baseApi.get(`/users/${id}`);
};

export const getUsersSearch = (search, page) => {
  return baseApi.get(`/users?q=${search}&_page=${page}&_limit=10`);
};

export default {
  getUsers,
  getUserById,
  getUsersSearch,
};
