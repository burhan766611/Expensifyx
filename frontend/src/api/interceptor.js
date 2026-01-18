import api from "./axios";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach(promise => {
    if (error) promise.reject(error);
    else promise.resolve();
  });
  failedQueue = [];
};

export const setupAxiosInterceptors = (logout) => {
  api.interceptors.response.use(
    res => res,

    async err => {
      const originalRequest = err.config;

      // ❌ Never refresh for /auth/me
      if (originalRequest.url.includes("/auth/me")) {
        return Promise.reject(err);
      }

      if (
        err.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/auth/login") &&
        !originalRequest.url.includes("/auth/refresh")
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => api(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await api.post("/auth/refresh", {}, { withCredentials: true });
          processQueue();
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          logout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(err);
    }
  );
};
