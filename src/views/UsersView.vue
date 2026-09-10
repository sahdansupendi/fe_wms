<script setup>
import SearchUser from "@/components/Users/SearchUser.vue";
import SearchAllUser from "@/components/Users/SearchAllUser.vue";
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
