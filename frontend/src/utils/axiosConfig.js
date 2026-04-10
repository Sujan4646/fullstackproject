import axios from 'axios';

// In production, use VITE_API_URL env variable; in dev, use empty string (Vite proxy handles it)
const baseURL = import.meta.env.VITE_API_URL || '';

axios.defaults.baseURL = baseURL;

export default axios;
