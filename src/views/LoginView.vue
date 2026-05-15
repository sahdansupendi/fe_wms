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
  <div class="login-container">
    <!-- Background -->
    <div class="bg">
      <div class="orb orb1"></div>
      <div class="orb orb2"></div>
      <div class="orb orb3"></div>
    </div>
    <div class="grid-overlay"></div>

    <!-- Card -->
    <div class="card">

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
</template>

<style scoped src="@/assets/css/login.css"></style>