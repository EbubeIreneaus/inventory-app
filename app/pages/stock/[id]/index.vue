<template>
  <div class="p-3 md:p-7">
    <div
      class="bg-surface-light dark:bg-surface-dark shadow-md rounded-lg p-6 py-10"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-semibold">Product Details</h2>
        <span
          class="px-3 py-1 text-xs font-medium rounded-full bg-green-900 text-success"
          v-if="stock?.isAvailable"
        >
          Available
        </span>
        <span
          class="px-3 py-1 text-xs font-medium rounded-full bg-red-900 text-error"
          v-else
        >
          Unavailable
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm opacity-50">Product Name</label>
          <p class="font-medium capitalize">{{ stock?.productName }}</p>
        </div>

        <div>
          <label class="block text-sm opacity-50">Category</label>
          <p class="font-medium capitalize">{{ stock?.category }}</p>
        </div>

        <div>
          <label class="block text-sm opacity-50">Quantity</label>
          <p class="font-medium">{{ stock?.quantity }}</p>
        </div>

        <div>
          <label class="block text-sm opacity-50">Size</label>
          <p class="font-medium">{{ stock?.quantity }}</p>
        </div>

        <div>
          <label class="block text-sm opacity-50">Unit Price</label>
          <p class="font-medium" v-naira="stock?.unitPrice"></p>
        </div>

        <div>
          <label class="block text-sm opacity-50">Selling Price</label>
          <p class="font-medium" v-naira="stock?.sellingPrice"></p>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm">Description</label>
          <p class="font-medium">
            {{ stock?.description }}
          </p>
        </div>
      </div>

      <div class="mt-8 flex gap-3">
        <u-button
          :to="`/stock/${id}/edit`"
          class=""
          variant="soft"
          color="info"
        >
          Edit
        </u-button>

        <u-button
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          @click="deleteStock()"
          :loading="isDeleting"
          icon="lucide:trash-2"
        >
          Delete
        </u-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const DataStore = useMyDataStore();
const { Stocks } = storeToRefs(DataStore);
const toast = useToast();
const route = useRoute();
const router = useRouter()
const { id } = route.params;

const isDeleting = ref(false)

const stock = computed(() => {
  return Stocks.value.find((s) => s.id == Number(id));
});

async function deleteStock() {
  isDeleting.value = true
  try {
    const res = await $fetch(`/api/stock/${id}/delete`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.statusCode == 200) {
      toast.add({
        title: "Deleted Successfully",
        color: "info",
        icon: "lucide:trash-2",
        description: "Stock item removed from database",
      });
      return router.push('/stock/')
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
</script>

<style></style>
