import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:3000/api/v1/mysdom",
  baseURL: "https://mysdom-api.onrender.com/api/v1/mysdom",//production
});

// 🔹 Attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Catch 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;