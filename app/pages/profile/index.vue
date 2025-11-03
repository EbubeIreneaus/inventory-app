<template>
  <div>
    <div class=" mx-auto p-4 md:p-10">
      <!-- Header -->
      <h1 class="text-2xl font-semibold opacity-40 mb-6">My Profile</h1>

      <!-- Profile Overview Card -->
      <div
        class="bg-surface-light dark:bg-surface-dark shadow rounded-lg p-6 mb-6"
      >
        <div
          class="flex flex-col sm:flex-row items-center sm:items-start gap-4"
        >
          <div class="flex-1 text-center capitalize">
            <h2 class="text-xl font-semibold opacity-40">{{ Auth?.firstname }} {{ Auth?.lastname }}</h2>
            <p class="text-sm font-semibold text-info">{{ Auth?.role }}</p>
            <p class="text-sm font-semibold text-secondary/50">{{ Auth?.city }}, Nigeria</p>
          </div>

          <!-- <button class="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50">
        Edit
      </button> -->
        </div>
      </div>

      <!-- Personal Info -->
      <div
        class="bg-surface-light dark:bg-surface-dark shadow rounded-lg p-6 mb-6"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold opacity-40">Personal Information</h3>
          <!-- <button class="text-sm px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-50">Edit</button> -->
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-gray-500">First Name</p>
            <p class="font-medium">{{ Auth?.firstname }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-500">Last Name</p>
            <p class="font-medium">{{ Auth?.lastname }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-500">Email Address</p>
            <p class=" font-medium">{{ Auth?.email }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-500">Phone</p>
            <p class=" font-medium">{{ Auth?.phone }}</p>
          </div>

          <div class="md:col-span-2">
            <p class="text-sm text-gray-500">Role</p>
            <p class=" font-medium">{{ Auth?.role }}</p>
          </div>
        </div>
      </div>

      <!-- Address -->
      <div class="bg-surface-light dark:bg-surface-dark shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold opacity-40">Address</h3>
          <!-- <button class="text-sm px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-50">Edit</button> -->
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-gray-500">Country</p>
            <p class=" font-medium">Nigeria</p>
          </div>

          <div>
            <p class="text-sm text-gray-500">City / State</p>
            <p class="font-medium">{{ Auth?.state }} {{ Auth?.city }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-500">Postal Code</p>
            <p class="font-medium">{{ Auth?.address }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-500">TAX ID</p>
            <p class="font-medium">ASL4564756</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const {Auth} = storeToRefs(useMyDataStore())
</script>

<style></style>
