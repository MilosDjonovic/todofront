import { defineStore } from 'pinia';
import { ref } from 'vue';
import { taskApi } from '@/api/tasks';

export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref([]);
    const filters = ref({
        priority: '',
        completed: '',
        search: ''
    });

    async function fetchTasks() {
        try {
            const response = await taskApi.getTasks(filters.value);
            console.log('API Response:', response);
            
            tasks.value = response.data.data || [];
            
            console.log('Updated tasks in store:', tasks.value);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            tasks.value = [];
            throw error;
        }
    }

    async function createTask(task) {
        try {
            const response = await taskApi.createTask(task);
            if (response.data.data) {
                tasks.value = [...tasks.value, response.data.data];
                return response.data.data;
            }
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    async function updateTask(id, task) {
        try {
            const response = await taskApi.updateTask(id, task);
            const index = tasks.value.findIndex(t => t.id === id);
            if (index !== -1 && response.data.data) {
                tasks.value = [
                    ...tasks.value.slice(0, index),
                    response.data.data,
                    ...tasks.value.slice(index + 1)
                ];
            }
            return response.data.data;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }

    async function deleteTask(id) {
        try {
            await taskApi.deleteTask(id);
            tasks.value = tasks.value.filter(task => task.id !== id);
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }

    function setFilter(key, value) {
        filters.value[key] = value;
        fetchTasks();
    }

    return {
        tasks,
        filters,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        setFilter
    };
});