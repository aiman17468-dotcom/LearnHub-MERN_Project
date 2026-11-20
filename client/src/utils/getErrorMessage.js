// Turns an Axios error into a message the user can understand
export default function getErrorMessage(error) {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.request) {
    return 'Cannot reach the server. Please check that the backend is running.';
  }
  return 'Something went wrong. Please try again.';
}
