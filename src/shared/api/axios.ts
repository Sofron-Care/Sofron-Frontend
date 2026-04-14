import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const isDemo = window.location.pathname.startsWith("/demo");
  const method = config.method?.toLowerCase();

  // Allow auth routes
  const allowedUrls = ["/auth/login", "/auth/refresh"];

  const isAllowed = allowedUrls.some((url) => config.url?.includes(url));

  if (
    isDemo &&
    ["post", "patch", "put", "delete"].includes(method || "") &&
    !isAllowed
  ) {
    console.warn("🚫 Demo mode blocked:", config.url);

    return Promise.reject({
      isDemoBlocked: true,
      message: "Demo mode: changes are disabled.",
    });
  }

  return config;
});

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};

    // If 401 and not already retrying
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // Attempt refresh
        await api.post("/auth/refresh");

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → logout
        window.location.href = "/demo/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
