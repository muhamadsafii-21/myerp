import axiosInstance from './axiosConfig';

export const getDashboardData = async () => {
    const response = await axiosInstance.get('/Dashboard');
    return response.data;
};