<script setup lang="ts">
definePageMeta({
  layout: "admin",
  permission: "DASHBOARD.VIEW",
});

useHead({
  title: "Dashboard | LMS Admin",
});
</script>

<template>
  <PagesDashboardContent />
</template>

