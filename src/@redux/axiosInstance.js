import Axios from "axios";

// Create an Axios instance
const axiosInstance = Axios.create({
    baseURL: sessionStorage.getItem("baseUrl"),
    withCredentials: true,
});

// Add request interceptor to attach "region" and "_cookie" to all requests
axiosInstance.interceptors.request.use(
    (config) => {
        const region = sessionStorage.getItem("region"); // Get region from session storage
        const _cookie = sessionStorage.getItem("_cookie"); // Get _cookie from session storage if available

        config.params = config.params || {};
        config.params.region = region; // Attach the region as a query param

        if (_cookie) {
            config.headers = config.headers || {};
            config.headers["Authorization"] = `${_cookie}`; // Attach _cookie in Authorization header
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;