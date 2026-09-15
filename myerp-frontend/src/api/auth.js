import axiosInstance from './axiosConfig';

export const login = async (username, password) => {
    const response = await axiosInstance.post('/Auth/login', {
        username,
        password
    });
    return response.data;
};