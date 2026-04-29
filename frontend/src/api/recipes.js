import api from './axios';

export const getRecipes = (params) => api.get('/recipes', { params });
export const getRecipe = (id) => api.get(`/recipes/${id}`);
export const createRecipe = (data) => api.post('/recipes', data);
export const updateRecipe = (id, data) => api.put(`/recipes/${id}`, data);
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);
export const rateRecipe = (id, value) => api.post(`/recipes/${id}/rate`, { value });
export const getAllRecipesAdmin = () => api.get('/recipes/admin/all');
