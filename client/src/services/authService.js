import api from './api.js';

export const registerUser = (data) => api.post('/register', data);
export const loginUser = (data) => api.post('/login', data);
export const getMe = () => api.get('/me');
