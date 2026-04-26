import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;
// console.log("apiUrl:",apiUrl);
const axiosInstance = axios.create({
  // baseURL:`${apiUrl}/api/v1/mysdom`
  baseURL: `${apiUrl}/api/v1/mysdom`,
  // baseURL: "http://209.145.54.27:8000/api/v1/mysdom",//production
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
    const hadToken = Boolean(localStorage.getItem("token"));

    if (error.response?.status === 401 && hadToken) {
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
