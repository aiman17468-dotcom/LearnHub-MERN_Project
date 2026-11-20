import api from './api.js';

export const enrollInCourse = (courseId) => api.post('/enroll', { courseId });
export const getEnrolledCourses = () => api.get('/my-courses');
export const updateProgress = (courseId, progress) =>
  api.put(`/my-courses/${courseId}/progress`, { progress });
