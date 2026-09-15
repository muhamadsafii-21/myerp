import axiosInstance from './axiosConfig';

export const getCustomers = async () => {
    const response = await axiosInstance.get('/Customers');
    return response.data;
};

export const getCustomerById = async (id) => {
    const response = await axiosInstance.get(`/Customers/${id}`);
    return response.data;
};

export const createCustomer = async (data) => {
    const response = await axiosInstance.post('/Customers', data);
    return response.data;
};

export const updateCustomer = async (id, data) => {
    const response = await axiosInstance.put(`/Customers/${id}`, data);
    return response.data;
};

export const deleteCustomer = async (id) => {
    const response = await axiosInstance.delete(`/Customers/${id}`);
    return response.data;
};