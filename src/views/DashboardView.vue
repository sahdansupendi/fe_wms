<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import DashboardSidebar from "@/components/DashboardSidebar.vue";
import DashboardHeader from "@/components/DashboardHeader.vue";

const route = useRoute();

const sidebarOpen = ref(false);
const activeTitle = computed(() => route.meta?.title || "Dashboard");

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

    <!-- ── SIDEBAR COMPONENT ── -->
    <DashboardSidebar
      v-model:sidebarOpen="sidebarOpen"
    />

    <!-- ===== MAIN ===== -->
    <div class="main-wrap">

      <!-- TOPBAR COMPONENT -->
      <DashboardHeader
        :title="activeTitle"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />

      <!-- Content -->
      <main class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped src="@/assets/css/dashboard.css"></style>
<style>
/* Page Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>