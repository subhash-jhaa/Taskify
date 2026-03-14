import axios from 'axios';

// Use relative URL in production to leverage Next.js rewrites (proxy)
// This solves cross-site cookie blocking between Vercel and Render
const isProduction = process.env.NODE_ENV === 'production';
const apiBaseURL = isProduction 
    ? '/api' 
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api');

const api = axios.create({
    baseURL: apiBaseURL,
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
            } catch (refreshError: any) {
                // Refresh failed (refresh token expired or server returned error)
                const errorMessage = refreshError.response?.data?.message || refreshError.message || 'Session expired';
                console.warn('Authentication failed:', errorMessage);

                // 🚀 Clear local indicator and redirect
                if (typeof document !== 'undefined') {
                    document.cookie = 'client_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                }

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
