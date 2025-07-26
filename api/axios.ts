import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5003/api', // Your backend base URL
});

export default api;
