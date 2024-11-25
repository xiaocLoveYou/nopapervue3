import api from './index';

// 登录
export const login = (data) => {
    return api.post('/api/auth/login', data);
};