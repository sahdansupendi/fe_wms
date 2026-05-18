import { defineStore } from "pinia";
import { refreshApi } from "@/api/auth.js";

let refreshTimer = null;

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: localStorage.getItem("token") || null,
        refreshToken: localStorage.getItem("refreshToken") || null,
        username: localStorage.getItem("username") || null,
        rolename: localStorage.getItem("rolename") || null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        setAuth(data) {
            this.token = data.token;
            this.refreshToken = data.refreshToken;
            this.username = data.username;
            this.rolename = data.rolename;

            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("username", data.username);
            localStorage.setItem("rolename", data.rolename);

            // Start timer setelah login berhasil
            this.startRefreshTimer();
        },

        clearAuth() {
            this.token = null;
            this.refreshToken = null;
            this.username = null;
            this.rolename = null;

            localStorage.clear();

            // Stop timer ketika logout
            this.stopRefreshTimer();
        },

        startRefreshTimer() {
            // Stop timer lama kalau ada
            this.stopRefreshTimer();

            // Refresh tiap 50 detik (10 detik sebelum 1 menit expired)
            refreshTimer = setInterval(async () => {
                await this.silentRefresh();
            }, 50 * 1000);

            console.log("Refresh timer started");
        },

        stopRefreshTimer() {
            if (refreshTimer) {
                clearInterval(refreshTimer);
                refreshTimer = null;
                console.log("Refresh timer stopped");
            }
        },

        async silentRefresh() {
            if (!this.refreshToken) {
                console.log("Refresh token tidak ada → logout");
                this.clearAuth();
                window.location.href = "/";
                return;
            }

            try {
                const response = await refreshApi(this.refreshToken);
                const newToken = response.data.data.token;
                const newRefreshToken = response.data.data.refreshToken;

                this.token = newToken;
                this.refreshToken = newRefreshToken;
                localStorage.setItem("token", newToken);
                localStorage.setItem("refreshToken", newRefreshToken);

            } catch (error) {
                console.log("Refresh token expired / invalid paksa logout");
                this.clearAuth();
                window.location.href = "/";
            }
        },

        // Panggil ini saat app pertama kali load (kalau user udah login sebelumnya)
        initAuth() {
            if (this.token && this.refreshToken) {
                this.startRefreshTimer();
            }
        },
    },
});