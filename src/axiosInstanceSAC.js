import axios from 'axios';

const axiosInstanceSAC = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL_SAC, 
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
});

axiosInstanceSAC.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        console.error('API SAC call failed:', error);
        return Promise.reject(error);
    } 
);

export default axiosInstanceSAC;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 