import axiosInstance from './axiosConfig';

export const getPurchaseReport = async (params) => {
    const response = await axiosInstance.get('/Reports/purchases', { params });
    return response.data;
};

export const getSalesReport = async (params) => {
    const response = await axiosInstance.get('/Reports/sales', { params });
    return response.data;
};

export const getStockReport = async (params) => {
    const response = await axiosInstance.get('/Reports/stock', { params });
    return response.data;
};