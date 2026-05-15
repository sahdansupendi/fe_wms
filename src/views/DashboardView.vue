<script setup>
import { ref, watch } from "vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/authStore";
import {logoutApi} from "@/api/auth";
import { getAllUsersApi, getUserByUsernameApi } from "@/api/user";

const router = useRouter();
const authStore = useAuthStore();

const activeMenu = ref("dashboard");
const sidebarOpen = ref(false);

const menuItems = [
  {id: "dashboard", label: "Dashboard", icon: "⊞"},
  {id: "users", label: "Users", icon: "⊙"},
  {id: "registeruser", label: "Register User", icon: "≡"},
  {id: "settings", label: "Settings", icon: "⚙"},
];

const stats = [
  {label: "Total Users", value: "1,284", delta: "+12%", up: true},
  {label: "Active Sessions", value: "38", delta: "+5%", up: true},
  {label: "Reports Today", value: "9", delta: "-2%", up: false},
  {label: "Uptime", value: "99.9%", delta: "Stable", up: true},
];

/* ─── Users state ─── */
const users          = ref([]);
const usersLoading   = ref(false);
const usersError     = ref("");

const searchQuery    = ref("");
const searchLoading  = ref(false);
const searchError    = ref("");
const searchResult   = ref(null);
const hasSearched    = ref(false);

/* ─── Fetch all users ─── */
const fetchAllUsers = async () => {
  usersLoading.value = true;
  usersError.value   = "";
  try {
    const res    = await getAllUsersApi();
    users.value  = res.data.data;
  } catch (e) {
    usersError.value = e.response?.data?.message || "Gagal memuat data users";
  } finally {
    usersLoading.value = false;
  }
};

/* ─── Search by username ─── */
const searchUser = async () => {
  if (!searchQuery.value.trim()) return;
  searchLoading.value = true;
  searchError.value   = "";
  searchResult.value  = null;
  hasSearched.value   = true;
  try {
    const res         = await getUserByUsernameApi(searchQuery.value.trim());
    searchResult.value = res.data.data;
  } catch (e) {
    searchError.value = e.response?.data?.message || "User tidak ditemukan";
  } finally {
    searchLoading.value = false;
  }
};

const clearSearch = () => {
  searchQuery.value  = "";
  searchResult.value = null;
  searchError.value  = "";
  hasSearched.value  = false;
};

/* ─── Load users saat menu Users dibuka ─── */
watch(activeMenu, (val) => {
  if (val === "users") fetchAllUsers();
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
              <span class="stat-delta" :class="stat.up ? 'up' : 'down'">
                {{ stat.up ? '↑' : '↓' }} {{ stat.delta }}
              </span>
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
            <h2 class="section-title">Search User</h2>
            <div class="search-row">
              <div class="search-input-wrap">
                <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                    v-model="searchQuery"
                    class="search-input"
                    type="text"
                    placeholder="Masukkan username..."
                    @keyup.enter="searchUser"
                />
                <button v-if="searchQuery" class="search-clear" @click="clearSearch">✕</button>
              </div>
              <button class="search-btn" :disabled="searchLoading || !searchQuery.trim()" @click="searchUser">
                <span v-if="searchLoading" class="spinner-sm"></span>
                <span v-else>Cari</span>
              </button>
            </div>

            <!-- Search error -->
            <div v-if="searchError" class="alert-error">
              ⚠ {{ searchError }}
            </div>

            <!-- Search result -->
            <div v-if="searchResult" class="search-result">
              <div class="result-header">
                <span class="result-label">Hasil pencarian</span>
                <button class="result-close" @click="clearSearch">✕</button>
              </div>
              <div class="user-detail-card">
                <div class="user-detail-avatar">
                  {{ searchResult.username[0].toUpperCase() }}
                </div>
                <div class="user-detail-info">
                  <p class="user-detail-name">{{ searchResult.username }}</p>
                  <p class="user-detail-email">{{ searchResult.email }}</p>
                  <span :class="['role-chip', roleColor(searchResult.rolename)]">
                    {{ searchResult.rolename }}
                  </span>
                </div>
              </div>
            </div>

            <!-- No result -->
            <div v-else-if="hasSearched && !searchLoading && !searchError" class="empty-state">
              <p>User tidak ditemukan</p>
            </div>
          </section>

          <!-- All users table -->
          <section class="users-table-card">
            <div class="table-header">
              <h2 class="section-title">All Users</h2>
              <button class="refresh-btn" :disabled="usersLoading" @click="fetchAllUsers">
                <svg :class="['refresh-icon', usersLoading ? 'spinning' : '']"
                     width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                  <path d="M8 16H3v5"/>
                </svg>
                Refresh
              </button>
            </div>

            <!-- Loading -->
            <div v-if="usersLoading" class="table-loading">
              <div class="spinner-lg"></div>
              <p>Memuat data...</p>
            </div>

            <!-- Error -->
            <div v-else-if="usersError" class="alert-error">
              ⚠ {{ usersError }}
            </div>

            <!-- Table -->
            <div v-else-if="users.length" class="table-wrap">
              <table class="users-table">
                <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(user, i) in users" :key="user.username"
                    :style="{ animationDelay: i * 0.05 + 's' }" class="table-row">
                  <td class="td-num">{{ i + 1 }}</td>
                  <td>
                    <div class="td-user">
                      <div class="td-avatar">{{ user.username[0].toUpperCase() }}</div>
                      <span>{{ user.username }}</span>
                    </div>
                  </td>
                  <td class="td-email">{{ user.email }}</td>
                  <td>
                      <span :class="['role-chip', roleColor(user.rolename)]">
                        {{ user.rolename }}
                      </span>
                  </td>
                </tr>
                </tbody>
              </table>
              <p class="table-count">Total: {{ users.length }} user</p>
            </div>

            <!-- Empty -->
            <div v-else class="empty-state">
              <p>Belum ada data user</p>
            </div>
          </section>

        </template>

        <!-- ══════════ OTHER PAGES ══════════ -->
        <template v-else>
          <div class="coming-soon">
            <p class="coming-icon">🚧</p>
            <p class="coming-text">{{ menuItems.find(m => m.id === activeMenu)?.label }} — Coming Soon</p>
          </div>
        </template>

      </main>
    </div>
  </div>
</template>

<style scoped src="@/assets/css/dashboard.css"></style>