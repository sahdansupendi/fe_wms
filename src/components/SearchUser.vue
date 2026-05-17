<script setup>
import { ref } from "vue";
import { getUserByUsernameApi } from "@/api/user";

const searchQuery   = ref("");
const searchLoading = ref(false);
const searchError   = ref("");
const searchResult  = ref(null);
const hasSearched   = ref(false);

/* emit kalau nanti parent mau tau hasilnya */
const emit = defineEmits(["searched"]);

const searchUser = async () => {
  if (!searchQuery.value.trim()) return;

  searchLoading.value = true;
  searchError.value   = "";
  searchResult.value  = null;
  hasSearched.value   = true;

  try {
    const res = await getUserByUsernameApi(
        searchQuery.value.trim()
    );

    searchResult.value = res.data.data;

    emit("searched", searchResult.value);

  } catch (e) {
    searchError.value =
        e.response?.data?.message ||
        "User tidak ditemukan";
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

const roleColor = (role) => {
  if (role?.includes("SUPERUSER")) return "chip-superuser";
  if (role?.includes("ADMIN")) return "chip-admin";
  return "chip-user";
};
</script>

<template>
  <section class="users-search-card">

    <h2 class="section-title">Search User</h2>

    <div class="search-row">

      <div class="search-input-wrap">
        <svg
            class="search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>

        <input
            v-model="searchQuery"
            class="search-input"
            type="text"
            placeholder="Masukkan username..."
            @keyup.enter="searchUser"
        />

        <button
            v-if="searchQuery"
            class="search-clear"
            @click="clearSearch"
        >
          ✕
        </button>
      </div>

      <button
          class="search-btn"
          :disabled="searchLoading || !searchQuery.trim()"
          @click="searchUser"
      >
        <span v-if="searchLoading" class="spinner-sm"></span>
        <span v-else>Cari</span>
      </button>

    </div>

    <!-- ERROR -->
    <div v-if="searchError" class="alert-error">
      ⚠ {{ searchError }}
    </div>

    <!-- RESULT -->
    <div v-if="searchResult" class="search-result">

      <div class="result-header">
        <span class="result-label">
          Hasil pencarian
        </span>

        <button
            class="result-close"
            @click="clearSearch"
        >
          ✕
        </button>
      </div>

      <div class="user-detail-card">

        <div class="user-detail-avatar">
          {{ searchResult.username[0].toUpperCase() }}
        </div>

        <div class="user-detail-info">

          <p class="user-detail-name">
            {{ searchResult.username }}
          </p>

          <p class="user-detail-email">
            {{ searchResult.email }}
          </p>

          <span
              :class="[
              'role-chip',
              roleColor(searchResult.rolename)
            ]"
          >
            {{ searchResult.rolename }}
          </span>

        </div>
      </div>
    </div>

    <!-- EMPTY -->
    <div
        v-else-if="
        hasSearched &&
        !searchLoading &&
        !searchError
      "
        class="empty-state"
    >
      <p>User tidak ditemukan</p>
    </div>

  </section>
</template>

<style scoped src="@/assets/css/searchUser.css"></style>