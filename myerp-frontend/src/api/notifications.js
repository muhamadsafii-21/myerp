import axiosInstance from './axiosConfig';

export const getNotifications = async () => {
    const response = await axiosInstance.get('/Notifications');
    return response.data;
};

export const getNotificationCount = async () => {
    const response = await axiosInstance.get('/Notifications/count');
    return response.data;
};