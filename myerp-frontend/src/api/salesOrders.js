import axiosInstance from './axiosConfig';

export const getSalesOrders = async () => {
    const response = await axiosInstance.get('/SalesOrders');
    return response.data;
};

export const getSalesOrderById = async (id) => {
    const response = await axiosInstance.get(`/SalesOrders/${id}`);
    return response.data;
};

export const createSalesOrder = async (data) => {
    const response = await axiosInstance.post('/SalesOrders', data);
    return response.data;
};

export const completeSalesOrder = async (id) => {
    const response = await axiosInstance.put(`/SalesOrders/${id}/complete`);
    return response.data;
};

export const deleteSalesOrder = async (id) => {
    const response = await axiosInstance.delete(`/SalesOrders/${id}`);
    return response.data;
};