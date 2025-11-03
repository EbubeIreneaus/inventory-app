<template>
  <div class="py-8">
    <u-card class="max-w-full w-full">
      <template #header>
        <h2 class="text-xl font-bold uppercase">Record Product</h2>
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
              label="save"
              size="xl"
              variant="subtle"
              color="secondary"
              @click="saveStock(true)"
              :loading="isLoading"
            />
            <u-button
              label="save & continue"
              size="xl"
              variant="subtle"
              color="success"
              @click="saveStock(false)"
              :loading="isLoading"
            />
          </div>
        </form>
      </div>
    </u-card>
  </div>
</template>

<script lang="ts" setup>
import type { StockInsert } from "~/types";
const categories = ["phone", "laptop", "watch", "tablet", "electronics"];

const isLoading = ref(false)
const toast = useToast()
const router = useRouter()

const { formData, reset } = useForm<StockInsert>({
  productName: "",
  category: "",
  description: "",
  isAvailable: true,
  unitPrice: "0.0",
  sellingPrice: '0.0',
  quantity: 1,
  size: "md",
});

async function saveStock(redirect: boolean) {
  try {
    isLoading.value = true
    const res = await $fetch('/api/stock/create', {
      method: 'PUT',
      body: formData.value,
      credentials: 'same-origin',
    })
    if (res.statusCode == 201) {
      toast.add({
        title: 'Product added successfully',
        color: 'success',
        icon: 'mdi:cart-plus',
      })
      if (redirect) router.push('/');
    }
  } catch (error: any) {
     toast.add({
        title: 'Failed Request',
        description: error.statusMessage || 'unknown server error occured',
        color: 'error',
        icon: 'lucide:triangle-alert',
      })
  } finally {
    isLoading.value = false
    reset()
  }
}
</script>

<style></style>
