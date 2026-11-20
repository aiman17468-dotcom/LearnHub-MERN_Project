import api from './api.js';

export const getCourses = (params) => api.get('/courses', { params });
export const getCourse = (id) => api.get(`/courses/${id}`);
export const getMyCreatedCourses = () => api.get('/courses/mine');
export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);
export const addLesson = (id, data) => api.post(`/courses/${id}/lessons`, data);
export const deleteLesson = (id, lessonId) => api.delete(`/courses/${id}/lessons/${lessonId}`);
