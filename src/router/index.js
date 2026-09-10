import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";

import { useAuthStore } from "@/stores/authStore";

const routes = [
    {
        path: "/",
        name: "login",
        component: LoginView,
    },
    {
        path: "/dashboard",
        component: DashboardView,
        meta: {
            requiresAuth: true,
        },
        children: [
            {
                path: "",
                name: "dashboard",
                component: () => import("@/views/DashboardHome.vue"),
                meta: { title: "Dashboard" }
            },
            {
                path: "users",
                name: "users",
                component: () => import("@/views/UsersView.vue"),
                meta: { title: "Users" }
            },
            {
                path: "register",
                name: "registeruser",
                component: () => import("@/components/Users/RegisterUser.vue"),
                meta: { title: "Register User" }
            },
            {
                path: "update",
                name: "updateuser",
                component: () => import("@/components/Users/UpdateUser.vue"),
                meta: { title: "Update User" }
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return "/";
    }
});

export default router;