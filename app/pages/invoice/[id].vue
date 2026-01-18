<template>
  <div class="py-2">
    <div class="flex justify-end">
      <u-button
        icon="lucide:printer"
        label="Print Invoice"
        color="info"
        class="rounded-none rounded-tr-lg"
        @click="print()"
      />
    </div>
    <div
      class="print:min-h-screen flex flex-col gap-y-10 p-10 bg-surface-light dark:bg-surface-dark"
      id="invoice"
      
    >
        <div>
          <div>
            <div class="text-center mb-10">
              <h1 class="text-2xl capitalize">Ebube Ireneaus Pharm & Store</h1>
              <p>Block 38, Veteran Plaza, Army Estate Kubwa, Abuja</p>
              <p>+234 701 234 5678, +234 812 346 5678</p>
            </div>
            <div class="flex justify-between my-5">
              <div class="w-full">
                <h2 class="opacity-50">Sales Person</h2>
                <p>
                  {{ Invoice?.user?.firstname }} {{ Invoice?.user?.lastname }}
                </p>
              </div>
              <div class="w-full">
                <h2 class="opacity-50">Bill To</h2>
                <p data-testId="invoice_buyer">{{ Invoice?.buyer }}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="">
            <table class="w-full">
              <thead class="border-b border-secondary/20">
                <tr class="mb-10">
                  <th>Stock Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="inv in Invoice?.products"
                  :key="inv.id"
                  class="py-20"
                >
                  <td>{{ inv.name }}</td>
                  <td>{{ inv.quantity }}</td>
                  <td><span v-naira="inv.unitPrice"></span></td>
                  <td>
                    <span v-naira="Number(inv.unitPrice) * inv.quantity"></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      <div class="mt-auto">
        <div class="pt-10 footer mt-auto">
          <div class="flex justify-end mb-9">
            <ul class="*:grid *:grid-cols-2 *:gap-x-20 *:mb-4">
              <li>
                <span>SubTotal</span>
                <span class="font-mono" data-testId="invoice_subtotal">{{
                  NairaFMT(Invoice?.totalAmount || 0, "standard")
                }}</span>
              </li>
              <li>
                <span>Tax</span>
                <span v-naira="0"></span>
              </li>
              <li>
                <span>Shipping</span>
                <span v-naira="0"></span>
              </li>
              <li>
                <span class="font-bold">Total</span>
                <span class="font-bold text-lg font-mono" data-testId="invoice_total">{{
                  NairaFMT(Invoice?.totalAmount || 0, "standard")
                }}</span>
              </li>
            </ul>
          </div>

          <div class="italic text-center text-sm">
            <p>
              NO REFUND OF MONEY after payments for GOODS recieved in good
              condition
            </p>
            <p>THANKS FOR YOUR PATRONAGE; PLEASE CALL AGAIN</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NairaFMT } from "~/lib";

const route = useRoute();
const { id } = route.params;
const DataStore = useMyDataStore();
const { Invoices } = storeToRefs(DataStore);

const Invoice = computed(() => {
  return Invoices.value.find((inv) => (inv.id == Number(id)));
});

function print() {
  window.print();
}
</script>

<style scoped>
th,
td {
  text-align: left;
  padding: 10px 5px;
}

@media print {
  @page {
    size: auto;
    margin: 0;
  }
  #invoice,
  #invoice * {
    visibility: visible;
  }
  #invoice {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background-color: white;
    color: black;
  }
}
</style>
