<template>
  <div>
    <div class="py-8">
      <u-card class="max-w-full w-full">
        <template #header>
          <h2 class="text-xl font-bold uppercase">Edit Product</h2>
        </template>
        <div class="py-6">
          <form>
            <div class="grid sm:grid-cols-2 gap-x-5 gap-y-4 sm:gap-y-7">
              <u-form-field label="Product Name" required>
                <u-input
                  placeholder="Iphone 15 pro max 256gb rom"
                  size="xl"
                  class="w-full"
                  required
                  v-model="formData.productName"
                />
              </u-form-field>
              <u-form-field label="Product Category" required>
                <u-select
                  :items="categories"
                  placeholder="Iphone series"
                  size="xl"
                  class="w-full"
                  v-model="formData.category as string"
                />
              </u-form-field>
              <u-form-field label="Quantities" required>
                <u-input
                  type="number"
                  placeholder="100"
                  size="xl"
                  class="w-full"
                  required
                  v-model="formData.quantity"
                />
              </u-form-field>
              <u-form-field label="Size" required>
                <u-select
                  :items="['sm', 'md', 'lg', 'xl', 'xxl']"
                  placeholder="md"
                  size="xl"
                  class="w-full"
                  v-model="formData.size as string"
                />
              </u-form-field>
              <u-form-field label="Unit Price" required>
                <u-input
                  type="text"
                  icon="mdi:currency-ngn"
                  inputmode="number"
                  placeholder="5000"
                  size="xl"
                  class="w-full"
                  v-model="formData.unitPrice"
                />
              </u-form-field>
              <u-form-field label="Selling Price" required>
                <u-input
                  type="text"
                  icon="mdi:currency-ngn"
                  inputmode="number"
                  placeholder="5000"
                  size="xl"
                  class="w-full"
                  v-model="formData.sellingPrice"
                />
              </u-form-field>
              <u-form-field label="Available" required>
                <u-select
                  :items="[true, false]"
                  size="xl"
                  class="w-full"
                  v-model:model-value="formData.isAvailable as boolean"
                />
              </u-form-field>
              <u-form-field label="Description" class="sm:col-span-2">
                <u-textarea
                  class="w-full"
                  size="xl"
                  v-model="formData.description"
                />
              </u-form-field>
            </div>
            <div class="mt-7 flex gap-5 flex-wrap">
              <u-button
                label="Update Product"
                size="xl"
                variant="subtle"
                color="secondary"
                @click="saveStock()"
                :loading="isLoading"
              />
            </div>
          </form>
        </div>
      </u-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { StockInsert, StockSelect } from "~/types";
const categories = ["phone", "laptop", "watch", "tablet", "electronics"];

const DataStore = useMyDataStore();
const { Stocks } = storeToRefs(DataStore);
const route = useRoute();
const { id } = route.params;

const isLoading = ref(false);
const toast = useToast();
const router = useRouter();

const stock = computed(() => {
  return Stocks.value.find((s) => s.id == Number(id));
});

const { formData, reset } = useForm({
  ...stock.value,
});

async function saveStock() {
    isLoading.value = true
  try {
    const res = await $fetch(`/api/stock/${id}/update`, {
      method: "POST",
      credentials: "include",
      body: formData.value
    });
    if (res.statusCode == 200) {
      toast.add({
        title: "Updated Successfully",
        color: "success",
        icon: "lucide:circle-check",
        description: "Stock item updated successfully",
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
    isLoading.value = false
  }
}
</script>

<style></style>
