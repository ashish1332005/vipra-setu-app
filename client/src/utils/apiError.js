export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.status) {
    return `${fallback}. Server returned ${error.response.status}.`;
  }

  if (error.request) {
    return 'Backend is not reachable. Please start the server on http://localhost:5000.';
  }

  return error.message || fallback;
};
