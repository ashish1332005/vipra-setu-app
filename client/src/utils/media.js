import api from '../services/api';

export const getMediaUrl = (url = '') => {
  if (!url || /^https?:\/\//i.test(url) || url.startsWith('data:')) return url;

  const apiBase = api.defaults.baseURL || '';
  const origin = apiBase.replace(/\/api\/?$/, '');

  return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
};
