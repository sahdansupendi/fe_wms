<script setup>
import SearchUser from "@/components/SearchUser.vue";
import SearchAllUser from "@/components/SearchAllUser.vue";
</script>

<template>
  <div class="users-view-layout">
    <SearchUser />
    <SearchAllUser />
  </div>
</template>

<style scoped>
.users-view-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
