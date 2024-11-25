// src/api/index.js
import axios from 'axios';

const api = axios.create({
    baseURL: "http://111.231.16.133:5000", // 基础 URL，根据实际情况修改
    timeout: 5000,  // 请求超时
});

// 请求拦截器
api.interceptors.request.use(
    config => {
        // 可以在这里添加 token 或其他请求头
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器（如果需要）
api.interceptors.response.use(
    response => {
        return response.data;  // 直接返回 data 部分
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;
