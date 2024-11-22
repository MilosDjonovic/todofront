import api from './auth';

export const taskApi = {
    getTasks: (filters = {}) => api.get('/tasks', { params: filters }),
    getTask: (id) => api.get(`/tasks/${id}`),
    createTask: (task) => api.post('/tasks', task),
    updateTask: (id, task) => api.put(`/tasks/${id}`, task),
    deleteTask: (id) => api.delete(`/tasks/${id}`)
};