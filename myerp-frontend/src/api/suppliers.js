import axiosInstance from './axiosConfig';

export const getSuppliers = async () => {
    const response = await axiosInstance.get('/Suppliers');
    return response.data;
};

export const getSupplierById = async (id) => {
    const response = await axiosInstance.get(`/Suppliers/${id}`);
    return response.data;
};

export const createSupplier = async (data) => {
    const response = await axiosInstance.post('/Suppliers', data);
    return response.data;
};

export const updateSupplier = async (id, data) => {
    const response = await axiosInstance.put(`/Suppliers/${id}`, data);
    return response.data;
};

export const deleteSupplier = async (id) => {
    const response = await axiosInstance.delete(`/Suppliers/${id}`);
    return response.data;
};