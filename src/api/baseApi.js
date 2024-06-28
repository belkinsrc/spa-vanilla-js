const apiServer = import.meta.env.DEV ?? 'http://localhost:1111';

const baseFetch = (url, params, config = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const _config = {
        ...config,
      };
      if (params) {
        _config['body'] = JSON.stringify(params);

        fetch(`${apiServer}${url}`, {
          ..._config,
        })
          .then((res) => res.json())
          .then(resolve, reject);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const fetchGet = (url, params = {}) => {
  return baseFetch(url, params);
};

const fetchPost = (url, params = {}, config = {}) => {
  return baseFetch(url, params, {
    ...config,
    method: 'POST',
  });
};

const fetchPut = (url, params = {}, config = {}) => {
  return baseFetch(url, params, {
    ...config,
    method: 'PUT',
  });
};

const fetchPatch = (url, params = {}, config = {}) => {
  return baseFetch(url, params, {
    ...config,
    method: 'PATCH',
  });
};

const fetchDelete = (url, params = {}, config = {}) => {
  return baseFetch(url, params, {
    ...config,
    method: 'DELETE',
  });
};

export default {
  get: fetchGet,
  post: fetchPost,
  put: fetchPut,
  patch: fetchPatch,
  delete: fetchDelete,
};
