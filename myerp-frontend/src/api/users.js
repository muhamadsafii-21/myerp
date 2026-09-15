import axiosInstance from './axiosConfig';

export const getProfile = async () => {
    const response = await axiosInstance.get('/Users/profile');
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await axiosInstance.put('/Users/profile', data);
    return response.data;
};

export const changePassword = async (data) => {
    const response = await axiosInstance.put('/Users/change-password', data);
    return response.data;
};

export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/Users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteAvatar = async () => {
    const response = await axiosInstance.delete('/Users/avatar');
    return response.data;
};