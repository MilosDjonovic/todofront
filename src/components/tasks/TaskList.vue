<!-- src/components/tasks/TaskList.vue -->
<template>
    <div class="max-w-4xl mx-auto p-6">
        <div class="mb-6 flex justify-between items-center">
            <h2 class="text-2xl font-bold">Tasks</h2>
            <button 
                @click="showCreateModal = true"
                class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Add Task
            </button>
        </div>

        <div class="mb-6 grid grid-cols-3 gap-4">
            <div>
                <label class="block text-gray-700 mb-2">Priority</label>
                <select 
                    v-model="taskStore.filters.priority"
                    @change="taskStore.fetchTasks()"
                    class="w-full p-2 border rounded"
                >
                    <option value="">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Status</label>
                <select 
                    v-model="taskStore.filters.completed"
                    @change="taskStore.fetchTasks()"
                    class="w-full p-2 border rounded"
                >
                    <option value="">All</option>
                    <option value="1">Completed</option>
                    <option value="0">Pending</option>
                </select>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Search</label>
                <input 
                    type="text"
                    v-model="taskStore.filters.search"
                    @input="taskStore.fetchTasks()"
                    class="w-full p-2 border rounded"
                    placeholder="Search tasks..."
                >
            </div>
        </div>

        <div v-if="!isLoading">
            <div v-if="taskStore.tasks.length > 0" class="space-y-4">
                <div 
                    v-for="task in taskStore.tasks" 
                    :key="task.id"
                    class="bg-white p-4 rounded-lg shadow"
                >
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <input 
                            type="checkbox"
                            :checked="task.completed"
                            @change="toggleTaskStatus(task)"
                        >
                        <h3 class="font-semibold" :class="{ 'line-through': task.completed }">
                            {{ task.title }}
                        </h3>
                    </div>
                    <div class="flex space-x-2">
                        <button 
                            @click="editTask(task)"
                            class="text-blue-500 hover:text-blue-700"
                        >
                            Edit
                        </button>
                        <button 
                            @click="deleteTask(task.id)"
                            class="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <p v-if="task.description" class="text-gray-600 mt-2">{{ task.description }}</p>
                <div class="mt-2 flex items-center space-x-2">
                    <span 
                        class="px-2 py-1 rounded text-sm"
                        :class="{
                            'bg-red-100 text-red-800': task.priority === 'high',
                            'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                            'bg-green-100 text-green-800': task.priority === 'low'
                        }"
                    >
                        {{ task.priority }}
                    </span>
                    <div v-if="task.labels && task.labels.length > 0" class="flex space-x-1">
                        <span 
                            v-for="label in task.labels"
                            :key="label"
                            class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm"
                        >
                            {{ label }}
                        </span>
                    </div>
                </div>
            </div>
            </div>
            <div v-else class="text-center text-gray-500 py-8">
                No tasks found
            </div>
        </div>
        <div v-else class="text-center text-gray-500 py-8">
            Loading tasks...
        </div>

        <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 class="text-xl font-bold mb-4">{{ editingTask ? 'Edit Task' : 'Create Task' }}</h3>
                <form @submit.prevent="handleSubmit">
                    <div class="mb-4">
                        <label class="block text-gray-700 mb-2">Title</label>
                        <input 
                            type="text"
                            v-model="taskForm.title"
                            required
                            class="w-full p-2 border rounded"
                        >
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 mb-2">Description</label>
                        <textarea
                            v-model="taskForm.description"
                            class="w-full p-2 border rounded"
                            rows="3"
                        ></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 mb-2">Priority</label>
                        <select 
                            v-model="taskForm.priority"
                            class="w-full p-2 border rounded"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 mb-2">Labels</label>
                        <TagSelect
                            v-model="labelInput"
                            :options="availableLabels"
                            placeholder="Select labels..."
                        />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 mb-2">Parent Task</label>
                        <select
                            v-model="taskForm.parent_id"
                            class="w-full p-2 border rounded"
                        >
                            <option :value="''">No parent task</option>
                            <template v-for="task in availableParentTasks" :key="task.id">
                                <option :value="task.id">{{ task.title }}</option>
                                <template v-for="child in task.children" :key="child.id">
                                    <option :value="child.id">─› {{ child.title }}</option>
                                    <template v-for="grandChild in child.children" :key="grandChild.id">
                                        <option :value="grandChild.id">──› {{ grandChild.title }}</option>
                                    </template>
                                </template>
                            </template>
                        </select>
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button 
                            type="button"
                            @click="closeModal"
                            class="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {{ editingTask ? 'Update' : 'Create' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTaskStore } from '@/store/tasks';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/store/auth';
import TagSelect from './TagSelect.vue';

const availableLabels = ['personal', 'work', 'shopping'];
const taskStore = useTaskStore();
const authStore = useAuthStore();
const { tasks } = storeToRefs(taskStore);

const showCreateModal = ref(false);
const editingTask = ref(null);
const labelInput = ref('');
const isLoading = ref(false);
const error = ref('');

const taskForm = ref({
    title: '',
    description: '',
    priority: 'medium',
    labels: [],
    parent_id: ''
});

const buildTaskHierarchy = (tasks, excludeId = null) => {
    if (!tasks?.length) return [];
    
    const taskMap = new Map();
    const roots = [];
  
    const isDescendantOf = (task, ancestorId) => {
        let current = task;
        while (current.parent_id) {
            if (current.parent_id === ancestorId) return true;
            current = tasks.find(t => t.id === current.parent_id);
            if (!current) break;
        }
        return false;
    };

    const validTasks = tasks.filter(task => 
        task.id !== excludeId && !isDescendantOf(task, excludeId)
    );
  
    validTasks.forEach(task => {
        taskMap.set(task.id, { ...task, children: [] });
    });
  
    validTasks.forEach(task => {
        const node = taskMap.get(task.id);
        if (task.parent_id && taskMap.has(task.parent_id)) {
            const parent = taskMap.get(task.parent_id);
            parent.children.push(node);
        } else {
            roots.push(node);
        }
    });
  
    return roots;
};

const availableParentTasks = computed(() => {
    const filteredTasks = taskStore.filters.priority || 
                         taskStore.filters.completed || 
                         taskStore.filters.search
        ? taskStore.tasks
        : taskStore.allTasks;

    return buildTaskHierarchy(
        filteredTasks,
        editingTask.value?.id
    );
});

taskStore.allTasks = [];

onMounted(async () => {
    if (!authStore.isAuthenticated) {
        router.push('/login');
        return;
    }
    try {
        isLoading.value = true;
        await taskStore.fetchTasks();
        taskStore.allTasks = [...taskStore.tasks];
    } catch (err) {
        console.error('Error fetching tasks:', err);
        error.value = 'Failed to load tasks';
    } finally {
        isLoading.value = false;
    }
});

const resetForm = () => {
    taskForm.value = {
        title: '',
        description: '',
        priority: 'medium',
        labels: []
    };
    labelInput.value = '';
    editingTask.value = null;
};

const closeModal = () => {
    showCreateModal.value = false;
    resetForm();
};

const handleSubmit = async () => {
    try {
        console.log('labelInput.value', labelInput.value);
        const formData = {
            ...taskForm.value,
            labels: labelInput.value,
            completed: false,
            parent_id: taskForm.value.parent_id || null
        };

        if (editingTask.value) {
            await taskStore.updateTask(editingTask.value.id, formData);
        } else {
            await taskStore.createTask(formData);
        }
        
        showCreateModal.value = false;
        resetForm();
        await taskStore.fetchTasks();
    } catch (error) {
        console.error('Error saving task:', error);
    }
};

const editTask = (task) => {
    editingTask.value = task;
    taskForm.value = {
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        labels: task.labels || [],
        parent_id: task.parent_id?.toString() || ''
    };
    labelInput.value = task.labels;
    showCreateModal.value = true;
};

const deleteTask = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            await taskStore.deleteTask(taskId);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
};

const toggleTaskStatus = async (task) => {
    try {
        await taskStore.updateTask(task.id, {
            ...task,
            completed: !task.completed
        });
    } catch (error) {
        console.error('Error updating task status:', error);
    }
};
</script>