import api from './index';

// 登录
export const login = (data) => {
    return api.post('/api/auth/login', data);
};

// 用户信息
export const info = () => {
    return api.get('/api/auth/info');
}

// 获取考勤记录
export const attendancelist = () => {
    return api.get('/api/attendance/attendancelist');
}

export const get_chart1 = () => {
    return api.get('/api/analysis/chart1');
}

export const get_chart2 = () => {
    return api.get('/api/analysis/chart2');
}

export const get_students = () => {
    return api.get('/api/attendance/getstudent');
}

export const get_todayAttendance = () => {
    return api.get('/api/attendance/todayattendancelist');
}

export const student_createLeaves = (data) => {
    return api.post('/api/attendance/studentcreateleavve', data)
}

export const upload_attendance = (data) => {
    return api.post('/api/attendance/classattendance', data);
}

export const getleaveserror = () => {
    return api.get('/api/analysis/getleaveserror');
}