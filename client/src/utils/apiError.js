const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://vipra-setu.onrender.com/api/';

export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.status) {
    return `${fallback}. Server returned ${error.response.status}.`;
  }

  if (error.request) {
    return `Backend is not reachable. Please check ${apiBaseUrl}.`;
  }

  return error.message || fallback;
};
