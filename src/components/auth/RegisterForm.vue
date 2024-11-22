<template>
    <form @submit.prevent="handleSubmit" class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        <h2 class="text-2xl font-bold mb-6">Register</h2>
        <div v-if="errormessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {{ errormessage }}
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 mb-2">Name</label>
            <input 
                type="text" 
                v-model="name" 
                required
                class="w-full p-2 border rounded"
            >
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 mb-2">Email</label>
            <input 
                type="email" 
                v-model="email" 
                required
                class="w-full p-2 border rounded"
            >
        </div>
        <div class="mb-6">
            <label class="block text-gray-700 mb-2">Password</label>
            <input 
                type="password" 
                v-model="password" 
                required
                class="w-full p-2 border rounded"
            >
        </div>
        <div class="mb-6">
            <label class="block text-gray-700 mb-2">Confirm Password</label>
            <input 
            type="password" 
            v-model="c_password" 
            required
            class="w-full p-2 border rounded"
            >
        </div>
        <button 
            type="submit"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
            Register
        </button>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const c_password = ref('');
const errormessage = ref('');

const handleSubmit = async () => {
    try {
        await auth.register({
            name: name.value,
            email: email.value,
            password: password.value,
            c_password: c_password.value
        });
        router.push('/tasks');
    } catch (error) {
        console.error('Registration failed:', error);
        errormessage.value = 'Registration failed';
    }
};
</script>