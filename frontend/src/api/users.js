import api from './axios';

// Planner
export const getMealPlan = () => api.get('/planner');
export const addMeal = (data) => api.post('/planner/add', data);
export const removeMeal = (data) => api.delete('/planner/remove', { data });
export const clearPlan = () => api.delete('/planner/clear');

// User
export const updateProfile = (data) => api.put('/users/profile', data);
export const toggleBookmark = (recipeId) => api.post(`/users/bookmarks/${recipeId}`);
export const getBookmarks = () => api.get('/users/bookmarks');
export const getMyRecipes = () => api.get('/users/my-recipes');

// Admin
export const getAdminStats = () => api.get('/users/admin/stats');
export const getAllUsers = () => api.get('/users/admin/users');
export const deleteUser = (id) => api.delete(`/users/admin/users/${id}`);
