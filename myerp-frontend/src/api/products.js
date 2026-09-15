import axiosInstance from './axiosConfig';

export const getProducts = async () => {
    const response = await axiosInstance.get('/Products');
    return response.data;
};

export const getProductById = async (id) => {
    const response = await axiosInstance.get(`/Products/${id}`);
    return response.data;
};

export const createProduct = async (data) => {
    const response = await axiosInstance.post('/Products', data);
    return response.data;
};

export const updateProduct = async (id, data) => {
    const response = await axiosInstance.put(`/Products/${id}`, data);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await axiosInstance.delete(`/Products/${id}`);
    return response.data;
};