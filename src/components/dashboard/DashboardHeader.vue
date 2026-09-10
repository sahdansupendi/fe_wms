<script setup>
import { useAuthStore } from "@/stores/authStore.js";

defineProps({
  title: {
    type: String,
    default: "Dashboard"
  }
});

const emit = defineEmits(["toggle-sidebar"]);
const authStore = useAuthStore();
</script>

<template>
  <header class="topbar">
    <button class="hamburger" @click="emit('toggle-sidebar')" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
    <div class="topbar-title">
      <h1 class="page-title">{{ title }}</h1>
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
</template>

<style scoped>
.topbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px 6px 32px;
    border-bottom: 1px solid #e5e7eb;
    background: #ffffff;
    position: sticky;
    top: 0;
    z-index: 20;
}

.hamburger {
    display: none;
    flex-direction: column;
    gap: 3px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    flex-shrink: 0;
}

.hamburger span {
    display: block;
    width: 16px;
    height: 2px;
    background: #6b7280;
    border-radius: 2px;
    transition: 0.2s;
}

.topbar-title {
    flex: 1;
}

.page-title {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #111827;
    margin: 0;
}

.page-sub {
    font-size: 10px;
    color: #6b7280;
    font-weight: 400;
    margin-top: 0px;
    margin-bottom: 0;
}

.page-sub strong {
    color: #111827;
    font-weight: 600;
}

.topbar-right {
    display: flex;
    align-items: center;
    gap: 6px;
}

.notif-btn {
    position: relative;
    width: 24px;
    height: 24px;
    background: #f3f4f6;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    cursor: pointer;
}
.notif-btn svg {
    width: 13px;
    height: 13px;
}

.notif-dot {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 5px;
    height: 5px;
    background: #ef4444;
    border-radius: 50%;
    border: 1.5px solid #ffffff;
    animation: dotPulse 2s ease infinite;
}

.avatar {
    width: 32px;
    height: 32px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 12px;
    flex-shrink: 0;
    color: #2563eb;
}

.avatar.sm {
    width: 24px;
    height: 24px;
    font-size: 10px;
}

@keyframes dotPulse {
    0%, 100% {
        opacity: 1
    }
    50% {
        opacity: 0.4
    }
}

@media (max-width: 768px) {
    .hamburger {
        display: flex;
    }
    .topbar {
        padding: 8px 12px;
    }
}

@media (max-width: 480px) {
    .page-sub {
        display: none;
    }
}
</style>
