import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import "./style.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Init auth timer kalau user udah login (misal refresh halaman)
import { useAuthStore } from "@/stores/authStore";
const authStore = useAuthStore();
authStore.initAuth();

app.mount("#app");