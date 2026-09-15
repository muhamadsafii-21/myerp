import axiosInstance from './axiosConfig';

export const getPurchaseOrders = async () => {
    const response = await axiosInstance.get('/PurchaseOrders');
    return response.data;
};

export const getPurchaseOrderById = async (id) => {
    const response = await axiosInstance.get(`/PurchaseOrders/${id}`);
    return response.data;
};

export const createPurchaseOrder = async (data) => {
    const response = await axiosInstance.post('/PurchaseOrders', data);
    return response.data;
};

export const receivePurchaseOrder = async (id) => {
    const response = await axiosInstance.put(`/PurchaseOrders/${id}/receive`);
    return response.data;
};

export const deletePurchaseOrder = async (id) => {
    const response = await axiosInstance.delete(`/PurchaseOrders/${id}`);
    return response.data;
};