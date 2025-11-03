<template>
  <div class="py-8">
    <u-card class="max-w-full w-full">
      <template #header>
        <h2 class="text-xl font-bold uppercase">Record Expense</h2>
      </template>
      <div class="py-6">
        <form>
          <div class="grid sm:grid-cols-2 gap-x-5 gap-y-4 sm:gap-y-7">
            <u-form-field label="Total Amount" required>
              <u-input
                type="text"
                icon="mdi:currency-ngn"
                inputmode="number"
                placeholder="5000"
                size="xl"
                class="w-full"
                v-model="formData.totalAmount"
              />
            </u-form-field>
            <u-form-field label="Paid Via" required>
              <u-select
                :items="['card', 'cash', 'transfer']"
                size="xl"
                class="w-full"
                v-model="formData.paymentType"
              />
            </u-form-field>
            <u-form-field label="category" required>
              <u-select
                :items="['personal', 'Utilities', 'Rent', 'Food']"
                size="xl"
                class="w-full"
                v-model:model-value="formData.category as string"
                />
            </u-form-field>
            <u-form-field label="Description" class="sm:col-span-2">
              <u-textarea
                class="w-full"
                size="xl"
                v-model="formData.desc"
                placeholder="What did you do?"
              />
            </u-form-field>
          </div>
          <div class="mt-7 flex gap-5 flex-wrap">
            <u-button
              label="save"
              size="xl"
              variant="subtle"
              color="secondary"
              @click="save(false)"
              :loading="isLoading"
            />
            <u-button
              label="save & continue"
              size="xl"
              variant="subtle"
              color="success"
              @click="save(true)"
              :loading="isLoading"
            />
          </div>
        </form>
      </div>
    </u-card>
  </div>
</template>

<script lang="ts" setup>
import type { ExpenseInsert} from "~/types";

const isLoading = ref(false)
const toast = useToast()
const router = useRouter()

const { formData, reset } = useForm<ExpenseInsert>({
   totalAmount: '',
   paymentType: 'cash',
   category: String(''),
   currency: '',
   desc:''
});

async function save(stay: boolean) {
  try {
    isLoading.value = true
    const res = await $fetch<{statusCode: number, invoiceId:number}>('/api/expense/create', {
      method: 'PUT',
      body: formData.value,
      credentials: 'same-origin',
    })
    if (res.statusCode == 201) {
      toast.add({
        title: 'Expense recorded successfully',
        color: 'success',
        icon: 'mdi:cart-plus',
      })
      if (!stay) router.push(`/expense`);
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
