import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Ensure this is set in your .env files
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // Requests timeout after 10000ms (10 seconds)
});

axiosInstance.interceptors.response.use(function (response) {
    // Successful response processing here, if needed
    return response;
}, function (error) {
    // Global error processing
    console.error('API call failed:', error);
    return Promise.reject(error);
});

export default axiosInstance;
