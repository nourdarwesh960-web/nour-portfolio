import axios from 'axios';
import { ADMIN_TOKEN_KEY } from '../constants/admin.js';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL, timeout: 30000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg = err?.response?.data?.error || err.message || 'Request failed';
    return Promise.reject(Object.assign(err, { friendlyMessage: msg }));
  },
);

const crud = (path) => ({
  list: () => api.get(path).then((r) => r.data),
  get: (id) => api.get(`${path}/${id}`).then((r) => r.data),
  create: (data) => api.post(path, data).then((r) => r.data),
  update: (id, data) => api.put(`${path}/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`${path}/${id}`).then((r) => r.data),
});

export const portfolioApi = {
  profile: {
    get: () => api.get('/profile').then((r) => r.data),
    update: (data) => api.put('/profile', data).then((r) => r.data),
  },
  projects: crud('/projects'),
  experience: crud('/experience'),
  stack: crud('/stack'),
  testimonials: crud('/testimonials'),
  metrics: crud('/metrics'),
  now: crud('/now'),
  ticker: crud('/ticker'),
  messages: {
    ...crud('/messages'),
    send: (data) => api.post('/messages', data).then((r) => r.data),
    markRead: (id, read) => api.patch(`/messages/${id}`, { read }).then((r) => r.data),
  },
  uploads: {
    profilePhoto: (file) => {
      const fd = new FormData();
      fd.append('file', file);
      return api
        .post('/uploads/profile-photo', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((r) => r.data);
    },
    removeProfilePhoto: () => api.delete('/uploads/profile-photo').then((r) => r.data),
  },
};
