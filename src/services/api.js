import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_URL) {
  throw new Error("[ERROR] VITE_API_BASE_URL is not defined");
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `[REQ] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      token ? "[Auth: YES]" : "[Auth: NO]"
    );

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (error.response) {
      console.error(
        "[ERROR] API Error:",
        error.response.status,
        error.response.data
      );
    }

    return Promise.reject(error);
  }
);

export default api;
