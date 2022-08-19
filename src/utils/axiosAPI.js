import axios from 'axios'

let baseUrl = 'https://retask-api.herokuapp.com/'

if (!navigator.onLine){
    baseUrl = 'http://localhost:8000/'
}

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'JWT ' + localStorage.getItem('access_token')
    }
});
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && error.response.statusText === "Unauthorized") {
            const refresh_token = localStorage.getItem('refresh_token');

            return axiosInstance
                .post('/api/v1/token/refresh/', { refresh: refresh_token })
                .then((response) => {
                    localStorage.setItem('access_token', response.data.access);
                    localStorage.setItem('refresh_token', response.data.refresh);

                    axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                    originalRequest.headers['Authorization'] = "JWT " + response.data.access;

                    return axiosInstance(originalRequest);
                })
                .catch(err => {
                    console.log(err)
                });
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;