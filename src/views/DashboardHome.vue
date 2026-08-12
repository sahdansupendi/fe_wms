<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { countusersApi } from "@/api/user";
import StatCard from "@/components/dashboard/StatCard.vue";
import SearchAllUser from "@/components/SearchAllUser.vue";

const authStore = useAuthStore();

/* ─── Users state ─── */
const users = ref(0);
const usersLoading = ref(false);
const usersError = ref("");

/* ─── Fetch all users ─── */
const countAllUsers = async () => {
  usersLoading.value = true;
  usersError.value   = "";
  try {
    const res = await countusersApi();
    users.value = res.data.data;
  } catch (e) {
    usersError.value = e.response?.data?.message || "Gagal memuat data users";
  } finally {
    usersLoading.value = false;
  }
};

onMounted(() => {
  countAllUsers();
});

/* ─── Role chip color ─── */
const roleColor = (role) => {
  if (role?.includes("SUPERUSER")) return "chip-superuser";
  if (role?.includes("ADMIN"))     return "chip-admin";
  return "chip-user";
};
</script>

<template>
  <div class="dashboard-layout">
    <section class="stats-grid">
      <StatCard label="Total Users" :value="users" :delay="0.08" />
    </section>

    <section class="dashboard-bottom">
      <div class="bottom-left">
        <SearchAllUser />
      </div>
      <div class="bottom-right">
        <section class="info-card">
          <div class="info-header">
            <h2 class="info-title">Account Overview</h2>
            <span class="info-badge">Active</span>
          </div>
          <div class="info-rows">
            <div class="info-row">
              <span class="info-key">Username</span>
              <span class="info-val">{{ authStore.username }}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Role</span>
              <span class="info-val"><span :class="['role-chip', roleColor(authStore.rolename)]">{{ authStore.rolename }}</span></span>
            </div>
            <div class="info-row">
              <span class="info-key">Status</span>
              <span class="info-val"><span class="status-dot"></span> Online</span>
            </div>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<style scoped src="@/assets/css/dashboard.css"></style>
