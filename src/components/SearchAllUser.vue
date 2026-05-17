<script setup>
import { ref, onMounted } from "vue";
import { getAllUsersApi } from "@/api/user";

const users = ref([]);
const usersLoading = ref(false);
const usersError = ref("");

const fetchAllUsers = async () => {
  usersLoading.value = true;
  usersError.value = "";

  try {
    const res = await getAllUsersApi();
    users.value = res.data.data;
  } catch (e) {
    usersError.value =
        e.response?.data?.message ||
        "Gagal memuat data users";
  } finally {
    usersLoading.value = false;
  }
};

onMounted(() => {
  fetchAllUsers();
});

const roleColor = (role) => {
  if (role?.includes("SUPERUSER")) return "chip-superuser";
  if (role?.includes("ADMIN")) return "chip-admin";
  return "chip-user";
};


</script>

<template>

  <section class="users-table-card">

    <div class="table-header">

      <h2 class="section-title">
        All Users
      </h2>

      <button
          class="refresh-btn"
          :disabled="usersLoading"
          @click="fetchAllUsers"
      >
        <svg
            :class="[
            'refresh-icon',
            usersLoading ? 'spinning' : ''
          ]"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
          <path d="M21 3v5h-5"/>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
          <path d="M8 16H3v5"/>
        </svg>

        Refresh
      </button>

    </div>

    <!-- LOADING -->
    <div
        v-if="usersLoading"
        class="table-loading"
    >
      <div class="spinner-lg"></div>
      <p>Memuat data...</p>
    </div>

    <!-- ERROR -->
    <div
        v-else-if="usersError"
        class="alert-error"
    >
      ⚠ {{ usersError }}
    </div>

    <!-- TABLE -->
    <div
        v-else-if="users.length"
        class="table-wrap"
    >

      <table class="users-table">

        <thead>
        <tr>
          <th>No</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
        </thead>

        <tbody>

        <tr
            v-for="(user, i) in users"
            :key="user.username"
            class="table-row"
            :style="{
              animationDelay: i * 0.05 + 's'
            }"
        >

          <td class="td-num">
            {{ i + 1 }}
          </td>

          <td>
            <div class="td-user">

              <div class="td-avatar">
                {{ user.username[0].toUpperCase() }}
              </div>

              <span>
                  {{ user.username }}
                </span>

            </div>
          </td>

          <td class="td-email">
            {{ user.email }}
          </td>

          <td>

              <span
                  :class="[
                  'role-chip',
                  roleColor(user.rolename)
                ]"
              >
                {{ user.rolename }}
              </span>

          </td>

        </tr>

        </tbody>

      </table>

      <p class="table-count">
        Total: {{ users.length }} user
      </p>

    </div>

    <!-- EMPTY -->
    <div
        v-else
        class="empty-state"
    >
      <p>Belum ada data user</p>
    </div>

  </section>

</template>

<style scoped src="@/assets/css/searchAllUser.css"></style>