import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/components/auth/LoginForm.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/components/auth/RegisterForm.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/tasks',
        name: 'tasks',
        component: () => import('@/components/tasks/TaskList.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/',
        redirect: '/tasks'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();
    
    // Only try to fetch user if we're not authenticated and going to a protected route
    if (!auth.isAuthenticated && to.meta.requiresAuth) {
        try {
            await auth.fetchUser();
            next();
        } catch (error) {
            next('/login');
        }
    } 
    // Redirect to tasks if trying to access guest routes while authenticated
    else if (auth.isAuthenticated && to.meta.requiresGuest) {
        next('/tasks');
    }
    // Otherwise, proceed normally
    else {
        next();
    }
});

export default router;