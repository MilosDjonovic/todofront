<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow mb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <router-link 
              v-if="auth.isAuthenticated" 
              to="/tasks" 
              class="flex items-center px-4 font-medium"
            >
              Tasks
            </router-link>
          </div>
          <div class="flex items-center">
            <template v-if="auth.isAuthenticated">
              <span class="mr-4">{{ auth.user?.name }}</span>
              <button 
                @click="logout" 
                class="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <router-link 
                to="/login" 
                class="text-gray-600 hover:text-gray-900 mr-4"
              >
                Login
              </router-link>
              <router-link 
                to="/register" 
                class="text-gray-600 hover:text-gray-900"
              >
                Register
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useAuthStore } from './store/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const logout = async () => {
  await auth.logout();
  router.push('/login');
};
</script>