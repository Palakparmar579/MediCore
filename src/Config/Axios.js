import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isInvalidToken = error.response?.data?.valid === false;

    if (status === 401 || isInvalidToken) {
      
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;