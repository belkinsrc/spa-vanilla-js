const apiServer = import.meta.env.DEV ?? 'http://localhost:1111';

const baseFetch = (url, config = {}, params) => {
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
