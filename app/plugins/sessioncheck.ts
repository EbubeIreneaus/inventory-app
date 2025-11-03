export default defineNuxtPlugin(async () => {
  const DataStore = useMyDataStore();

  try {
    const res = await $fetch<{ statusCode: number; user: any }>(
      "/api/auth/info"
    );
    if (res.statusCode == 200) {
      DataStore.isLoggedIn = true;
      DataStore.Auth = res.user;
    } else {
      DataStore.logout();
    }
  } catch (error) {
    return DataStore.logout();
  }
});
