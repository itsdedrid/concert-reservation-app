import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const r = err?.response?.data;
    const arr = Array.isArray(r?.message) ? r.message : undefined;
    const msg = arr?.join(' | ') || r?.message || err.message || 'Network Error';
    return Promise.reject({ ...err, message: msg });
  }
);

export default api;