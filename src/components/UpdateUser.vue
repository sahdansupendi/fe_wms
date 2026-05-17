<script setup>
import { ref, reactive, computed } from "vue";
import { updateuserApi } from "@/api/user.js";
import { useAuthStore } from "@/stores/authStore.js";

const emit = defineEmits(['navigate']);

const authStore = useAuthStore();

/*
  STATE
*/

const form = reactive({
  username: authStore.username || '',
  email: '',
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


const validate = () => {
  const e = {};
  const { username, email, roleid } = form;

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
    roleid: form.roleid,
  };

  try {
    const response = await updateuserApi(authStore.userid,payload);
    const data = response.data;

    if (data.success) {
      successMsg.value = data.message || 'Update User Successfully';
      savedUser.value = data.data;
      resetForm();
    }
    console.log("berhasil")

  } catch (err) {

    const res = err.response?.data;
    console.log(res);

    if (res?.details) {

      errors.value = { ...res.details };

      globalError.value =
          Object.values(res.details).join(', ') || 'Validation Error';
    } else {

      globalError.value =
          res?.message || 'Tidak dapat terhubung ke server';
    }

  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.username = authStore.username || '';
  form.email = '';
  form.roleid = '';
  errors.value = {};
  globalError.value = '';
};
</script>

<template>
  <div class="content">

    <!-- Form Card -->
    <div class="update-card">
      <div class="update-card-header">
        <div class="update-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
        </div>
        <span class="update-card-title">Informasi Pengguna</span>
      </div>

      <!-- Success Alert -->
      <div v-if="successMsg" class="alert-success reg-alert">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             style="flex-shrink:0">
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
                readonly
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
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline
                  points="22,6 12,13 2,6"/>
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
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 .49-3.4"/>
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
  </div>
</template>

<style scoped src="@/assets/css/updateUser.css"></style>