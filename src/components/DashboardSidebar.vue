<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { logoutApi } from "@/api/auth";
import { useRouter, useRoute } from "vue-router";

const props = defineProps({
  sidebarOpen: Boolean,
});

const emit = defineEmits(["update:sidebarOpen"]);

const authStore = useAuthStore();
const router = useRouter();

const route = useRoute();

// Format date for sidebar: dd/MM/yyyy
const today = new Date();
const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

// Nested Menu Data
const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  {
    id: "parent-users",
    label: "Users",
    icon: "⊙",
    children: [
      { id: "users", label: "List User" },
      { id: "registeruser", label: "Register User" },
      { id: "updateuser", label: "Update User" },
    ]
  }
];

// Keep track of which parent menus are open
const openMenus = ref({
  "parent-users": false // closed by default
});

const isCollapsed = ref(false);

const toggleMenu = (id) => {
  openMenus.value[id] = !openMenus.value[id];
};

const selectMenu = (id) => {
  router.push({ name: id });
  emit("update:sidebarOpen", false);
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
</script>

<template>
  <!-- Mobile overlay -->
  <div
      class="mob-overlay"
      :class="{ active: sidebarOpen }"
      @click="emit('update:sidebarOpen', false)"
  ></div>

  <!-- ── SIDEBAR ── -->
  <aside class="sidebar" :class="{ open: sidebarOpen, collapsed: isCollapsed }">
    <button class="collapse-btn" @click="isCollapsed = !isCollapsed" title="Toggle Sidebar">
      <svg v-if="!isCollapsed" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
    <div class="sidebar-inner">
      <div class="sidebar-logo">
        <div class="logo-icon">⬡</div>
        <span class="logo-text">WMS</span>
      </div>

      <nav class="sidebar-nav">
      <p class="nav-label">Main Menu</p>
      
      <template v-for="item in menuItems" :key="item.id">
        <!-- If no children (Single Menu) -->
        <button
            v-if="!item.children"
            class="nav-item" :class="{ active: route.name === item.id }"
            @click="selectMenu(item.id)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.label }}</span>
          <span v-if="route.name === item.id" class="nav-pip"></span>
        </button>

        <!-- If has children (Nested Menu) -->
        <div v-else class="nav-parent-wrap">
          <button
              class="nav-item nav-parent"
              :class="{ open: openMenus[item.id] }"
              @click="toggleMenu(item.id)"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-text">{{ item.label }}</span>
            <svg class="chevron" :class="{ open: openMenus[item.id] }" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          <div class="nav-children" :class="{ open: openMenus[item.id] }">
            <button
                v-for="child in item.children" :key="child.id"
                class="nav-child-item" :class="{ active: route.name === child.id }"
                @click="selectMenu(child.id)"
            >
              <span class="nav-child-text">{{ child.label }}</span>
              <span v-if="route.name === child.id" class="nav-pip"></span>
            </button>
          </div>
        </div>
      </template>
    </nav>

    <div class="sidebar-user">
      <div class="user-meta">
        <p class="user-name">{{ authStore.username }}</p>
        <p class="date-text">{{ formattedDate }}</p>
      </div>
      <button class="logout-btn" @click="logout" title="Logout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </div>
    </div> <!-- end sidebar-inner -->
  </aside>
</template>

<style scoped>
/* ── Mobile overlay ── */
.mob-overlay {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 30;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    opacity: 0;
    transition: opacity 0.3s;
}

.mob-overlay.active {
    opacity: 1;
}

/* ── Sidebar ── */
.sidebar {
    position: relative;
    z-index: 40;
    width: 200px;
    height: 100%;
    background: #ffffff;
    border-right: 1px solid #e5e7eb;
    flex-shrink: 0;
    transition: width 0.32s cubic-bezier(0.22, 1, 0.36, 1), transform 0.32s;
}

.sidebar.collapsed {
    width: 0;
}

.sidebar-inner {
    width: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    overflow: hidden;
    opacity: 1;
    visibility: visible;
    transition: opacity 0.2s ease, visibility 0s;
}

.sidebar.collapsed .sidebar-inner {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0s 0.2s;
}

.collapse-btn {
    position: absolute;
    top: 14px;
    right: -24px;
    width: 24px;
    height: 24px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-left: none;
    border-radius: 0 6px 6px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    z-index: 50;
    transition: background 0.2s, color 0.2s;
    box-shadow: 2px 0 4px rgba(0,0,0,0.02);
}

.collapse-btn:hover {
    background: #f3f4f6;
    color: #111827;
}

.sidebar-logo {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 12px 12px;
    border-bottom: 1px solid #e5e7eb;
}

.logo-icon {
    width: 24px;
    height: 24px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #111827;
}

.logo-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #111827;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

.sidebar-nav {
    flex: 1;
    padding: 10px 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.nav-label {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #9ca3af;
    padding: 0 6px;
    margin-bottom: 4px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    background: none;
    border: none;
    border-radius: 6px;
    padding: 6px 8px;
    color: #4b5563;
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    text-align: left;
    position: relative;
    transition: background 0.18s, color 0.18s;
}

.nav-item:hover {
    background: #f3f4f6;
    color: #111827;
}

.nav-item.active {
    background: #eff6ff;
    color: #1d4ed8;
    font-weight: 600;
    border-left: 3px solid #2563eb;
    padding-left: 5px; /* offset the 3px border to keep total width same: 8px padding - 3px border = 5px */
}

.nav-icon {
    font-size: 14px;
    width: 16px;
    text-align: center;
}

.nav-pip {
    position: absolute;
    right: 8px;
    width: 4px;
    height: 4px;
    background: #2563eb;
    border-radius: 50%;
    box-shadow: 0 0 6px #2563eb;
}

/* New Nested Menu Styles */
.nav-parent-wrap {
    margin-bottom: 2px;
}

.chevron {
    margin-left: auto;
    transition: transform 0.2s;
    color: #9ca3af;
}

.chevron.open {
    transform: rotate(180deg);
}

.nav-children {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding-left: 24px;
    margin-top: 0px;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 0.3s ease, opacity 0.3s ease, margin 0.3s ease;
}

.nav-children.open {
    max-height: 200px;
    opacity: 1;
    margin-bottom: 2px;
}

.nav-child-item {
    display: flex;
    align-items: center;
    width: 100%;
    background: none;
    border: none;
    border-radius: 6px;
    padding: 5px 8px;
    color: #6b7280;
    font-family: 'Sora', sans-serif;
    font-size: 11px;
    font-weight: 400;
    cursor: pointer;
    text-align: left;
    position: relative;
    transition: background 0.18s, color 0.18s;
}

.nav-child-item:hover {
    color: #111827;
}

.nav-child-item.active {
    color: #2563eb;
    font-weight: 600;
    border-left: 3px solid #2563eb;
    padding-left: 5px;
    background: #eff6ff;
}

.sidebar-user {
    margin: 0 8px 8px 8px;
    padding: 10px 8px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 8px;
}

.date-text {
    font-size: 10px;
    color: #6b7280;
    margin-top: 2px;
    font-family: 'JetBrains Mono', monospace;
}

.user-meta {
    flex: 1;
    min-width: 0;
}

.user-name {
    font-size: 12px;
    font-weight: 600;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}



.logout-btn {
    background: none;
    border: none;
    border-radius: 6px;
    padding: 6px;
    color: #9ca3af;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background 0.18s, color 0.18s;
    flex-shrink: 0;
}

.logout-btn:hover {
    background: #fee2e2;
    color: #ef4444;
}

@media (max-width: 768px) {
    .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100dvh;
        width: 200px;
        transform: translateX(-100%);
    }

    .sidebar.open {
        transform: translateX(0);
    }
    
    .collapse-btn {
        display: none; /* Hide toggle button on mobile, use hamburger */
    }

    .mob-overlay {
        display: block;
        pointer-events: none;
    }

    .mob-overlay.active {
        pointer-events: auto;
    }
}
</style>
