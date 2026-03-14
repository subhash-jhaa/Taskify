import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api',
    withCredentials: true,
});

// Response interceptor to handle errors and silent refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 🛡️ Skip refresh flow for the initial auth check to avoid console noise
        if (originalRequest.headers?.['x-auth-check']) {
            return Promise.reject(error);
        }

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                await axios.post(
                    `${api.defaults.baseURL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed (refresh token expired)
                console.warn('Session expired: Refresh token also invalid.');

                // 🚀 Redirect to login page immediately
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            }
        }

        const message = error.response?.data?.message || 'An unexpected error occurred';
        return Promise.reject({ ...error, message });
    }
);

export default api;
