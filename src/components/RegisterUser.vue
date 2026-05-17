<script setup>

import { ref, reactive, computed } from "vue";
import { registerserApi } from "@/api/user.js";

const emit = defineEmits(['navigate']);

/*
  STATE
*/

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  roleid: '',
});

const roles = ref([
  { id: '00', name: 'Super User' },
  { id: '01', name: 'Admin' },
  { id: '02', name: 'User' },
]);

const errors = ref({});
const globalError = ref('');
const successMsg = ref('');
const loading = ref(false);
const showPassword = ref(false);
const confirmShowPassword = ref(false);
const savedUser = ref(null);

/*
  COMPUTED
*/

const selectedRole = computed(() => {
  return roles.value.find(r => r.id === form.roleid) || null;
});

/*
  METHODS
*/

const clearError = (field) => {

  if (errors.value[field]) {

    const e = { ...errors.value };

    delete e[field];

    errors.value = e;
  }

  globalError.value = '';
  successMsg.value = '';
};

const roleChipClass = (id) => {

  if (id === '00') return 'chip-superuser';

  if (id === '01') return 'chip-admin';

  return 'chip-user';
};

const roleChipByName = (name) => {

  if (!name) return 'chip-user';

  const n = name.toUpperCase();

  if (n.includes('SUPER')) return 'chip-superuser';

  if (n.includes('ADMIN')) return 'chip-admin';

  return 'chip-user';
};

const validate = () => {

  const e = {};

  const username = form.username;
  const email = form.email;
  const password = form.password;
  const confirmPassword = form.confirmPassword;
  const roleid = form.roleid;

  if (!username) {
    e.username = 'Username wajib diisi';
  } else if (username.length < 3) {
    e.username = 'Username minimal 3 karakter';
  }

  if (!email) {
    e.email = 'Email wajib diisi';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    e.email = 'Format email tidak valid';
  }

  if (!password) {
    e.password = 'Password wajib diisi';
  } else if (password.length < 6) {
    e.password = 'Password minimal 6 karakter';
  }

  if (!confirmPassword) {
    e.confirmPassword = 'Konfirmasi Password wajib diisi';
  } else if (confirmPassword.length < 6) {
    e.confirmPassword = 'Konfirmasi Password minimal 6 karakter';
  }

  if (password !== confirmPassword) {
    e.confirmPassword = 'Password tidak sama';
  }

  if (!roleid) {
    e.roleid = 'Role wajib dipilih';
  }

  errors.value = e;

  return Object.keys(e).length === 0;
};

const handleSubmit = async () => {

  globalError.value = '';
  successMsg.value = '';
  savedUser.value = null;

  if (!validate()) return;

  loading.value = true;

  const payload = {
    username: form.username.trim().toLowerCase(),
    email: form.email.trim().toLowerCase(),
    password: form.password,
    roleid: form.roleid,
  };

  try {

    const response = await registerserApi(payload);

    const data = response.data;

    if (data.success) {

      successMsg.value =
          data.message || 'Register User Successfully';

      savedUser.value = data.data;

      resetForm();
    }

  } catch (err) {

    const res = err.response?.data;
    console.log(res.details);

    /*
      HANDLE VALIDATION ERROR
    */

    if (res?.details) {

      errors.value = { ...res.details };

      globalError.value =
          Object.values(res.details).join(', ') || 'Validation Error';
    }

    /*
      HANDLE GENERAL ERROR
    */

    else {

      globalError.value =
          res?.message ||
          'Tidak dapat terhubung ke server';
    }

  } finally {

    loading.value = false;
  }
};

const resetForm = () => {

  form.username = '';
  form.email = '';
  form.password = '';
  form.confirmPassword = '';
  form.roleid = '';

  errors.value = {};
  globalError.value = '';
  showPassword.value = false;
  confirmShowPassword.value = false;
};

</script>

<template>
  <div class="content">

    <!-- Form Card -->
    <div class="register-card">
      <div class="register-card-header">
        <div class="register-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
        </div>
        <span class="register-card-title">Informasi Pengguna</span>
      </div>

      <!-- Success Alert -->
      <div v-if="successMsg" class="alert-success reg-alert">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {{ successMsg }}
      </div>

      <form class="reg-form" @submit.prevent="handleSubmit" novalidate>
        <!-- Username -->
        <div class="form-group" :class="{ 'has-error': errors.username }">
          <label class="form-label">
            Username
            <span class="required-star">*</span>
          </label>
          <div class="input-wrap">
            <span class="input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <input
                v-model="form.username"
                type="text"
                class="reg-input"
                placeholder="Masukkan username"
                autocomplete="username"
                :disabled="loading"
                @input="clearError('username')"
            />
          </div>
          <span v-if="errors.username" class="field-error">{{ errors.username }}</span>
        </div>

        <!-- Email -->
        <div class="form-group" :class="{ 'has-error': errors.email }">
          <label class="form-label">
            Email
            <span class="required-star">*</span>
          </label>
          <div class="input-wrap">
            <span class="input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <input
                v-model="form.email"
                type="email"
                class="reg-input"
                placeholder="Masukkan email"
                autocomplete="email"
                :disabled="loading"
                @input="clearError('email')"
            />
          </div>
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>

        <!-- Password -->
        <div class="form-group" :class="{ 'has-error': errors.password }">
          <label class="form-label">
            Password
            <span class="required-star">*</span>
          </label>
          <div class="input-wrap">
            <span class="input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="reg-input"
                placeholder="Masukkan password"
                autocomplete="new-password"
                :disabled="loading"
                @input="clearError('password')"
            />
            <button type="button" class="toggle-pass" @click="showPassword = !showPassword" tabindex="-1">
              <!-- Eye open -->
              <svg v-if="!showPassword" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <!-- Eye off -->
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <!-- Konfirmasi Password -->
        <div class="form-group" :class="{ 'has-error': errors.confirmPassword }">
          <label class="form-label">
            Konfrimasi Password
            <span class="required-star">*</span>
          </label>
          <div class="input-wrap">
            <span class="input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input
                v-model="form.confirmPassword"
                :type="confirmShowPassword ? 'text' : 'password'"
                class="reg-input"
                placeholder="Masukkan Konfirmasi password"
                autocomplete="new-password"
                :disabled="loading"
                @input="clearError('password')"
            />
            <button type="button" class="toggle-pass" @click="confirmShowPassword = !confirmShowPassword" tabindex="-1">
              <!-- Eye open -->
              <svg v-if="!confirmShowPassword" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <!-- Eye off -->
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
          <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
        </div>

        <!-- Role ID -->
        <div class="form-group" :class="{ 'has-error': errors.roleid }">
          <label class="form-label">
            Role
            <span class="required-star">*</span>
          </label>
          <div class="input-wrap select-wrap">
            <span class="input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </span>
            <select
                v-model="form.roleid"
                class="reg-select"
                :disabled="loading"
                @change="clearError('roleid')"
            >
              <option value="" disabled>Pilih Role</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.id }} — {{ role.name }}
              </option>
            </select>
            <span class="select-arrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </div>

          <!-- Role Preview Chip -->
          <div v-if="selectedRole" class="role-preview">
            <span :class="['role-chip', roleChipClass(form.roleid)]">
              {{ selectedRole.name }}
            </span>
            <span class="role-preview-id">ID: {{ form.roleid }}</span>
          </div>

          <span v-if="errors.roleid" class="field-error">{{ errors.roleid }}</span>
        </div>

        <!-- Divider -->
        <div class="form-divider"></div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="button" class="btn-reset" @click="resetForm" :disabled="loading">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.4"/>
            </svg>
            Reset
          </button>
          <button type="submit" class="search-btn reg-submit" :disabled="loading">
            <span v-if="loading" class="spinner-sm"></span>
            <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ loading ? 'Menyimpan...' : 'Simpan Pengguna' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Success Result Card -->
<!--    <transition name="slide-up">
      <div v-if="savedUser" class="result-card">
        <div class="result-card-header">
          <div class="result-success-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <span class="result-title">Pengguna Berhasil Didaftarkan</span>
          <button class="result-close" @click="savedUser = null">✕</button>
        </div>
        <div class="result-user-detail">
          <div class="user-detail-avatar">{{ savedUser.username.charAt(0).toUpperCase() }}</div>
          <div class="user-detail-info">
            <div class="user-detail-name">{{ savedUser.username }}</div>
            <div class="user-detail-email">{{ savedUser.email }}</div>
          </div>
          <span :class="['role-chip', roleChipByName(savedUser.rolename)]">{{ savedUser.rolename }}</span>
        </div>
      </div>
    </transition>-->
  </div>
</template>

<style scoped src="@/assets/css/registerUser.css"></style>