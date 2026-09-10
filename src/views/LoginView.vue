<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {loginApi} from "@/api/auth";
import {useAuthStore} from "@/stores/authStore";
import BaseButton from "@/components/BaseButton.vue";

const router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

const login = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    const response = await loginApi({
      username: username.value,
      password: password.value,
    });

    authStore.setAuth(response.data.data);
    console.log("isAuthenticated:", authStore.isAuthenticated);
    await router.push("/dashboard");
    console.log("Login Berhasil");
    console.log("rolename:", response.data.data.rolename);
  } catch (error) {
    console.log(error);
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = "Login gagal. Periksa username dan password.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="split-layout">
    <!-- Left: Form -->
    <div class="left-panel">
      <div class="form-wrapper">
        <div class="logo-area">
          <div class="logo-icon">W</div>
          <div class="logo-text">WMS SYSTEM</div>
        </div>

        <h1 class="heading">Selamat Datang</h1>
        <p class="subheading">Masuk ke akun Anda untuk melanjutkan</p>

        <div v-if="errorMessage" class="error-box">
          ⚠️ {{ errorMessage }}
        </div>

        <div class="field">
          <label>Username</label>
          <div class="input-wrap">
            <span class="input-icon">👤</span>
            <input v-model="username" type="text" placeholder="Masukkan username"/>
          </div>
        </div>

        <div class="field">
          <label>Password</label>
          <div class="input-wrap">
            <span class="input-icon">🔒</span>
            <input v-model="password" type="password" placeholder="Masukkan password" @keyup.enter="login"/>
          </div>
        </div>

        <BaseButton
            id="btn-login"
            name="loginButton"
            label="Masuk"
            variant="primary"
            full
            :loading="loading"
            @click="login"
        />
      </div>
    </div>

    <!-- Right: Image -->
    <div class="right-panel">
      <div class="image-overlay">
<!--        <h2>Manajemen Gudang<br/>Modern & Efisien</h2>
        <p>Kendalikan inventaris, pantau stok, dan tingkatkan produktivitas bisnis Anda.</p>-->
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/css/login.css"></style>