<template>
  <div></div>
</template>

<script lang="ts" setup>
const router = useRouter();
const cookie = useCookie("Authorization");
const DataStore = useMyDataStore()

DataStore.logout()

if (cookie.value) {
  cookie.value = null;
}
router.push("/auth/login");
</script>

<style></style>
