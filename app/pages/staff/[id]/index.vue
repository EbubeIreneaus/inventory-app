<template>
  <div class="px-3 md:px-7 py-5">
    <div
      class=" bg-surface-light dark:bg-surface-dark shadow-md rounded-lg p-6"
    >
      <div class="flex items-center justify-between flex-wrap mb-6">
        <h2 class="text-2xl font-semibold">User Profile</h2>
        <div class="flex gap-x-5">
          <span
            class="px-3 py-1 text-xs font-medium rounded-full capitalize bg-green-900 text-success"
          >
            Previlage: {{ user?.previlage }}
          </span>
          <span
            class="px-3 py-1 text-xs font-medium rounded-full capitalize bg-blue-900 text-info"
          >
            Role: {{ user?.role }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm opacity-50">First Name</label>
          <p class="font-medium">{{ user?.firstname }}</p>
        </div>

        <div>
          <label class="block text-sm opacity-50">Last Name</label>
          <p class="font-medium">{{ user?.lastname }}</p>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm opacity-50">Email</label>
          <p class="font-medium">{{ user?.email }}</p>
        </div>

        <div>
          <label class="block text-sm opacity-50">Phone</label>
          <p class="font-medium">{{ user?.phone }}</p>
        </div>

        <div>
          <label class="block text-sm opacity-50">State</label>
          <p class="font-medium">{{ user?.state }}</p>
        </div>

        <div>
          <label class="block text-sm opacity-50">City</label>
          <p class="font-medium">{{ user?.city }}</p>
        </div>

        <div>
          <label class="block text-sm opacity-50">Address</label>
          <p class="font-medium">{{ user?.address }}</p>
        </div>

        <div>
          <label class="block text-sm opacity-50">Date of Birth</label>
          <p class="font-medium">
            {{ new Date(user?.dob || "").toLocaleDateString() }}
          </p>
        </div>

        <div>
          <label class="block text-sm opacity-50">Created At</label>
          <p class="font-medium">
            {{ new Date(user?.createdAt || "").toLocaleDateString() }}
          </p>
        </div>

        <div>
          <label class="block text-sm opacity-50">Active Status</label>
          <p class="font-medium text-green-600" v-if="user?.isActive">Active</p>
          <p class="font-medium text-red-600" v-else>Deactive</p>
        </div>

        <div>
          <label class="block text-sm opacity-50">Email Verified</label>
          <p class="font-medium text-green-600" v-if="user?.isEmailVerified">
            Verified
          </p>
          <p class="font-medium text-red-600" v-else>Not Verified</p>
        </div>
      </div>

      <div class="mt-8 flex flex-wrap gap-3">
        <u-button
      :to="`/staff/${id}/edit`"
          class="px-4 py-2"
          variant="link"
          color="info"
        >
          Edit
        </u-button>
         <u-button
          class="px-4  rounded-md"
          @click="logout()"
          :loading="isLoggingOut"
          color="info"
          variant="subtle"
        >
          Logout 
        </u-button>

        <u-button
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          @click="deleteStaff()"
          :loading="isDeleting"
        >
          Delete
        </u-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const DataStore = useMyDataStore();
const { Staffs } = storeToRefs(DataStore);
const route = useRoute();
const { id } = route.params;

const toast = useToast()
const router = useRouter()
const isDeleting = ref(false)
const isLoggingOut = ref(false)


const user = computed(() => {
  return Staffs.value.find((s) => (s.id = Number(id)));
});

async function deleteStaff () {
  isDeleting.value = true
  try {
    const res = await $fetch(`/api/staff/${id}/delete`, {
      method: 'DELETE',
      credentials: 'include'
    })
    if (res.statusCode == 200) {
      toast.add({
        title: 'Deleted Successfully',
        color: 'info',
        icon: 'lucide:trash-2',
        description: 'Staff account deleted successfully'
      })
      return router.push('/staff')
    }
  } catch (error: any) {
    toast.add({
      title: "Failed",
      color: "error",
      icon: "lucide:circle-alert",
      description: error.statusMessage || "unknown server error",
    });
  } finally {
    isDeleting.value = false
  }
}

async function logout() {
  isLoggingOut.value = true;
  try {
    const res = await $fetch(`/api/staff/${id}/update`, {
      method: "POST",
      body: {sessionId: null},
    });
    if (res.statusCode == 200) {
      toast.add({
        title: "User Logged Out Successfully",
        icon: "lucide:user-round-check",
        color: "info",
      });
    }
  } catch (error: any) {
    return toast.add({
      color: "error",
      title: "Failed",
      description: error.statusMessage || "Unexpected error occured",
      icon: "lucide:triangle-alert",
    });
  } finally {
    isLoggingOut.value = false;
  }
}
</script>

<style></style>
