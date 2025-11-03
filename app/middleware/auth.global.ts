export default defineNuxtRouteMiddleware((to, from) => {
    const DataStore = useMyDataStore()
    const {isLoggedIn} = storeToRefs(DataStore)

    if (!isLoggedIn.value && !to.path.includes('/auth/')) {
        return navigateTo('/auth/login')
    }
})
