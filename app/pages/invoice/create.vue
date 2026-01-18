<template>
  <div class="py-8">
    <u-card class="max-w-full w-full">
      <template #header>
        <h2 class="text-xl font-bold uppercase">Create Invoice</h2>
      </template>
      <div class="py-6">
        <form>
          <div class="grid sm:grid-cols-2 gap-x-5 gap-y-4 sm:gap-y-7">
            <u-form-field label="Customer Name">
              <u-input
                placeholder="John Doe"
                size="xl"
                class="w-full"
                required
                v-model="formData.buyer"
              />
            </u-form-field>
            <u-form-field label="Payment Method" required>
              <u-select
                :items="['cash', 'transfer', 'debt', 'card']"
                placeholder="Iphone series"
                size="xl"
                class="w-full"
                v-model="formData.paymentType"
              />
            </u-form-field>
            <u-form-field label="Size" required>
              <u-select
                :items="['NGN']"
                placeholder="md"
                size="xl"
                class="w-full"
                v-model="formData.currency as string"
              />
            </u-form-field>
          </div>

          <div class="mt-3">
            <div class="py-5 mb-3">
              <u-table
                :data="formData.products || []"
                empty="Empty products"
                title="Items"
              />
            </div>

            <div class="dark:bg-surface-dark bg-surface-light py-10 rounded-xl">
              <form
                @submit.prevent="addProductToInvoice"
                class="flex gap-x-5 justify-center items-center flex-wrap gap-y-5"
              >
                <u-form-field
                  label="Stock Item"
                  required
                  class="max-w-[200px] w-full"
                >
                  <u-select
                    size="xl"
                    placeholder="stock"
                    :items="Products"
                    class="w-full"
                    v-model="productForm.name"
                    required
                  />
                </u-form-field>

                <u-form-field label="Quantity" required>
                  <div class="flex border border-primary w-fit rounded">
                    <u-button
                      icon="mdi:minus"
                      size="xl"
                      class="rounded-none"
                      color="error"
                      @click="productForm.quantity -= 1"
                      :disabled="productForm.quantity <= 0"
                    />
                    <u-input
                      class="w-[70px]"
                      size="xl"
                      variant="none"
                      :ui="{ base: 'rounded-l-none rounded-r-none' }"
                      v-model="productForm.quantity"
                    />
                    <u-button
                      icon="mdi:plus"
                      @click="productForm.quantity += 1"
                      size="xl"
                      class="rounded-none"
                      color="info"
                    />
                  </div>
                </u-form-field>

                <u-form-field label="Selling Unit Price" required>
                  <u-input
                    size="xl"
                    inputmode="decimal"
                    required
                    placeholder="10000"
                    icon="mdi:currency-ngn"
                    v-model="productForm.unitPrice"
                  />
                </u-form-field>

                <u-form-field label="Total price" required>
                  <u-input
                    size="xl"
                    inputmode="decimal"
                    required
                    placeholder="10000"
                    icon="mdi:currency-ngn"
                    v-model="productForm.amount"
                  />
                </u-form-field>

                <div class="flex self-end gap-x-3">
                  <u-button
                    label="Add To Invoice"
                    color="success"
                    size="xl"
                    variant="subtle"
                    type="submit"
                  />
                  <u-button
                    label="Reset"
                    color="error"
                    size="xl"
                    @click="productReset()"
                  />
                </div>
              </form>
            </div>
          </div>
           <p
            v-if="errorMsg"
            data-testId="invoice_creation_error_display"
            class="my-3 text-red-500"
          >
            Error: {{ errorMsg }}
          </p>
          <div class="mt-7 flex gap-5 flex-wrap">
            <u-button
              label="save"
              size="xl"
              variant="subtle"
              color="secondary"
              :loading="isLoading"
              @click="save(false)"
              
            />
            <u-button
              label="save & print"
              size="xl"
              variant="subtle"
              color="success"
              :loading="isLoading"
              @click="save(true)"
            />
          </div>
        </form>
      </div>
    </u-card>
  </div>
</template>

<script lang="ts" setup>
import type { InvoiceInsert } from "~/types";
const categories = ["phone", "laptop", "watch", "tablet", "electronics"];
const DataStore = useMyDataStore();
const { Stocks } = storeToRefs(DataStore);

const Products = computed(() => {
  return Stocks.value.map((stock) => ({
    label: stock.productName,
    value: `${stock.id};${stock.productName}`,
  }));
});

const { formData: productForm, reset: productReset } = useForm({
  id: "",
  name: "",
  quantity: 1,
  amount: "",
  unitPrice: "0.0",
});

const isLoading = ref(false);
const toast = useToast();
const router = useRouter();
const errorMsg = ref<null | string>(null)

const { formData, reset } = useForm<InvoiceInsert>({
  buyer: "",
  currency: "NGN",
  products: [],
  paymentType: "cash",
  totalAmount: "0.0",
});

const addProductToInvoice = async () => {
  const product = productForm.value;
  const split = product.name.split(";");
  const name = split[1]|| '';
  const id = split[0] || '0';
  formData.value.products?.push({ ...product, name, id: Number(id) });
  productReset();
};

async function save(print: boolean) {
  try {
    errorMsg.value = null
    isLoading.value = true;

    if (!formData.value.products || formData.value.products.length < 1) {
     return errorMsg.value = "Invoice must contain at least one product"
    }

    const res = await $fetch<{ statusCode: number; invoiceId: number }>(
      "/api/invoice/create",
      {
        method: "PUT",
        body: formData.value,
        credentials: "same-origin",
      }
    );
    if (res.statusCode == 201) {
      toast.add({
        title: "Invoice Created successfully",
        color: "success",
        icon: "mdi:cart-plus",
      });
      if (print) router.push(`/invoice/${res.invoiceId}`);
    }
  } catch (error: any) {
    errorMsg.value = error.statusMessage || "unknown server error occured"
    toast.add({
      title: "Failed Request",
      description: error.statusMessage || "unknown server error occured",
      color: "error",
      icon: "lucide:triangle-alert",
    });
  } finally {
    isLoading.value = false;
    reset();
  }
}
</script>

<style></style>
