import baseApi from './baseApi';

export const getUsers = (page) => {
  return baseApi.get(`/api/users?_page=${page}&_limit=10`);
};

export const getUserById = (id) => {
  return baseApi.get(`/api/users/${id}`);
};

export const getUsersSearch = (search, page) => {
  return baseApi.get(`/api/users?_q=${search}&_page=${page}&_limit=10`);
};

export default {
  getUsers,
  getUserById,
  getUsersSearch,
};
