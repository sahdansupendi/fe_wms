<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/authStore";
import {logoutApi} from "@/api/auth";
import {countusersApi} from "@/api/user";
import SearchUser from "@/components/SearchUser.vue";
import SearchAllUser from "@/components/SearchAllUser.vue";
import RegisterUser from "@/components/RegisterUser.vue";
import UpdateUser from "@/components/UpdateUser.vue";

const router = useRouter();
const authStore = useAuthStore();

const activeMenu = ref("dashboard");
const sidebarOpen = ref(false);

const menuItems = [
  {id: "dashboard", label: "Dashboard", icon: "⊞"},
  {id: "users", label: "Users", icon: "⊙"},
  {id: "registeruser", label: "Register User", icon: "≡"},
  {id: "updateuser", label: "Update User", icon: "⚙"},
];

/*const stats = [
  {label: "Total Users", value: "1,284", delta: "+12%", up: true},
  {label: "Active Sessions", value: "38", delta: "+5%", up: true},
  {label: "Reports Today", value: "9", delta: "-2%", up: false},
  {label: "Uptime", value: "99.9%", delta: "Stable", up: true},
];*/

/* ─── Users state ─── */
// const users          = ref([]);
const users = ref(0);
const usersLoading   = ref(false);
const usersError     = ref("");

/* ─── Fetch all users ─── */
const countAllUsers = async () => {
  usersLoading.value = true;
  usersError.value   = "";
  try {
    const res    = await countusersApi();
    console.log(res.data)
    users.value = res.data.data;
  } catch (e) {
    usersError.value = e.response?.data?.message || "Gagal memuat data users";
  } finally {
    usersLoading.value = false;
  }
};

const loadDashboard = async () => {
  await countAllUsers();
};

const stats = computed(() =>[
  {
    label: "Total Users",
    value: users.value,
  }
]);

/* ─── Load users saat menu Dashboard dibuka ─── */
onMounted(() => {
  countAllUsers();
});

watch(activeMenu, async (newMenu) => {
  if (newMenu === "dashboard"){
    await loadDashboard();
  }
});

/* ─── Role chip color ─── */
const roleColor = (role) => {
  if (role?.includes("SUPERUSER")) return "chip-superuser";
  if (role?.includes("ADMIN"))     return "chip-admin";
  return "chip-user";
};

const logout = async () => {
  try {
    await logoutApi();
  } catch (error) {
    console.log(error);
  }
  authStore.clearAuth();
  router.push("/");
};

/* ─── Rsgitser User ─── */

</script>

<template>
  <div class="dash-root">

    <!-- BG orbs (sama kayak login) -->
    <div class="bg" aria-hidden="true">
      <div class="orb orb1"></div>
      <div class="orb orb2"></div>
      <div class="orb orb3"></div>
    </div>
    <div class="grid-overlay" aria-hidden="true"></div>

    <!-- Mobile overlay -->
    <div
        class="mob-overlay"
        :class="{ active: sidebarOpen }"
        @click="sidebarOpen = false"
    ></div>

    <!-- ── SIDEBAR ── -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-logo">
        <div class="logo-icon">⬡</div>
        <span class="logo-text">AdminOS</span>
      </div>

      <nav class="sidebar-nav">
        <p class="nav-label">Main Menu</p>
        <button
            v-for="item in menuItems" :key="item.id"
            class="nav-item" :class="{ active: activeMenu === item.id }"
            @click="activeMenu = item.id; sidebarOpen = false"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.label }}</span>
          <span v-if="activeMenu === item.id" class="nav-pip"></span>
        </button>
      </nav>

      <div class="sidebar-user">
        <div class="avatar">{{ (authStore.username || 'U')[0].toUpperCase() }}</div>
        <div class="user-meta">
          <p class="user-name">{{ authStore.username }}</p>
          <p class="user-role">{{ authStore.rolename }}</p>
        </div>
        <button class="logout-btn" @click="logout" title="Logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>

    <!-- ===== MAIN ===== -->
    <div class="main-wrap">

      <!-- Topbar -->
      <header class="topbar">
        <button class="hamburger" @click="sidebarOpen = !sidebarOpen" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
        <div class="topbar-title">
          <h1 class="page-title">{{ menuItems.find(m => m.id === activeMenu)?.label }}</h1>
          <p class="page-sub">Welcome back, <strong>{{ authStore.username }}</strong></p>
        </div>
        <div class="topbar-right">
          <div class="notif-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="notif-dot"></span>
          </div>
          <div class="avatar sm">{{ (authStore.username || 'U')[0].toUpperCase() }}</div>
        </div>
      </header>

      <!-- Content -->
      <main class="content">

        <!-- ══════════ DASHBOARD PAGE ══════════ -->
        <template v-if="activeMenu === 'dashboard'">
          <section class="stats-grid">
            <div
                v-for="(stat, i) in stats" :key="stat.label"
                class="stat-card" :style="{ animationDelay: i * 0.08 + 's' }"
            >
              <p class="stat-label">{{ stat.label }}</p>
              <p class="stat-value">{{ stat.value }}</p>
            </div>
          </section>

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
        </template>

        <!-- ══════════ USERS PAGE ══════════ -->
        <template v-else-if="activeMenu === 'users'">

          <!-- Search by username -->
          <section class="users-search-card">
            <SearchUser />
          </section>

          <!-- All users table -->
          <SearchAllUser/>

        </template>

        <!-- ══════════ REGISTER USER ══════════ -->
        <template v-else-if="activeMenu === 'registeruser' ">
          <RegisterUser/>
        </template>

        <!-- ══════════ UPDATE USER ══════════ -->
        <template v-else-if="activeMenu === 'updateuser' ">
          <UpdateUser/>
        </template>

      </main>
    </div>
  </div>
</template>

<style scoped src="@/assets/css/dashboard.css"></style>