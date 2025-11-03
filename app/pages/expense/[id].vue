<template>
  <div class="p-5 lg:p-10">
    <div class="bg-surface-light dark:bg-surface-dark shadow-md rounded-lg p-6">
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-2xl font-semibold">Expenses Details</h2>
    <span class="px-3 py-1 text-xs font-medium rounded-full bg-blue-900 text-info">
      {{expense?.paymentType  }}
    </span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

    <div>
      <label class="block text-sm opacity-50">Category</label>
      <p class="font-medium ">{{ expense?.category }}</p>
    </div>

    <div>
      <label class="block text-sm opacity-50">Total Amount</label>
      <p class="font-medium ">{{ NairaFMT(expense?.totalAmount || 0, 'standard') }}</p>
    </div>

    <div>
      <label class="block text-sm opacity-50">Currency</label>
      <p class="font-medium ">NGN</p>
    </div>

    <div>
      <label class="block text-sm opacity-50">Payment Type</label>
      <p class="font-medium  capitalize">{{ expense?.paymentType }}</p>
    </div>

    <div>
      <label class="block text-sm opacity-50">Created At</label>
      <p class="font-medium ">{{ new Date(expense?.createdAt || '').toLocaleDateString() }}</p>
    </div>

    <div class="md:col-span-2">
      <label class="block text-sm opacity-50">Description</label>
      <p class="font-medium ">
        {{ expense?.desc }}
      </p>
    </div>

    <div class="md:col-span-2 pt-4 border-t mt-5">
      <label class="block text-sm opacity-50">Recorded By</label>
      <p class="font-medium ">
        {{ expense?.user?.firstname }} {{ expense?.user?.lastname }} — <span class="text-blue-600 italic">staff</span>
      </p>
    </div>

  </div>


</div>

  </div>
</template>

<script lang="ts" setup>
import { NairaFMT } from '~/lib';

const DataStore = useMyDataStore();
const { Expenses } = storeToRefs(DataStore);
const route = useRoute();
const { id } = route.params;

const expense = computed(() => {
  return Expenses.value.find((s) => s.id == Number(id));
});
</script>

<style>

</style>