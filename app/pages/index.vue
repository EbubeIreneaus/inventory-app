<template>
  <div class="py-10">
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mb-10">
      <u-card
        class="lg:rounded-r-none lg:rounded-bl-lg md:rounded-b-none md:rounded-r-none rounded-b-none bg-surface-light dark:bg-surface-dark"
      >
        <div class="">
          <p class="text-theme-sm text-gray-500 dark:text-gray-400">Sales</p>

          <div class="mt-3 flex items-center justify-between">
            <div>
              <h4
                class="text-2xl font-bold text-gray-800 dark:text-white/90"
                :title="TotalSalesAmount.toFixed(2).toString()"
              >
                <span v-naira="TotalSalesAmount"></span>
              </h4>
            </div>

            <div class="flex items-center gap-1">
              <span
                class="flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500"
              >
                +20%
              </span>

              <span class="text-xs"> today </span>
            </div>
          </div>
        </div>
      </u-card>
      <u-card
        class="lg:rounded-none md:rounded-b-none md:rounded-l-none rounded-none bg-surface-light dark:bg-surface-dark"
      >
        <div class="">
          <p class="text-theme-sm text-gray-500 dark:text-gray-400">Expenses</p>

          <div class="mt-3 flex items-center justify-between">
            <div>
              <h4 class="text-2xl font-bold text-gray-800 dark:text-white/90">
                <span v-naira="TotalExpenseAmount"></span>
              </h4>
            </div>

            <div class="flex items-center gap-1">
              <span
                class="flex items-center gap-1 rounded-full bg-red-900 px-2 py-0.5 text-xs font-medium text-red-200"
              >
                -20%
              </span>

              <span class="text-xs"> today </span>
            </div>
          </div>
        </div>
      </u-card>
      <u-card
        class="lg:rounded-none md:rounded-t-none md:rounded-r-none rounded-none bg-surface-light dark:bg-surface-dark"
      >
        <div class="">
          <p class="text-theme-sm text-gray-500 dark:text-gray-400">In-Stock</p>

          <div class="mt-3 flex items-center justify-between">
            <div>
              <h4 class="text-2xl font-bold text-gray-800 dark:text-white/90">
                {{ ProductInStock }}
              </h4>
            </div>

            <div class="flex items-center gap-1">
              <span
                class="flex items-center gap-1 rounded-full bg-info px-2 py-0.5 text-xs font-bold text-dark"
              >
                /{{ Stocks.length || 0 }}
              </span>

              <span class="text-xs"> today </span>
            </div>
          </div>
        </div>
      </u-card>
      <u-card class="md:rounded-l-none rounded-t-none lg:rounded-tr-lg bg-surface-light dark:bg-surface-dark">
        <div class="">
          <p class="text-theme-sm text-gray-500 dark:text-gray-400">
            Out-of-Stock
          </p>

          <div class="mt-3 flex items-center justify-between">
            <div>
              <h4 class="text-2xl font-bold text-gray-800 dark:text-white/90">
                {{ ProductOutOfStock }}
              </h4>
            </div>

            <div class="flex items-center gap-1">
              <span
                class="flex items-center gap-1 rounded-full bg-info px-2 py-0.5 text-xs font-medium text-dark"
              >
                / {{ Stocks.length }}
              </span>

              <span class="text-xs"> today </span>
            </div>
          </div>
        </div>
      </u-card>
    </div>
    <div class="">
      <div class="grid lg:grid-cols-4 md:grid-cols-3">
        <u-card class="col-span-1 rounded-r-none bg-surface-light dark:bg-surface-dark">
          <template #header>
            <h2>Payment Details</h2>
          </template>
          <ul>
            <li
              v-for="[title, value] in Invoicepayments"
              :key="title"
              class="flex justify-between items-center py-3 border-b border-primary/30 lg:px-3 text-sm lg:text-base"
            >
              <span class="uppercase font-semibold">{{ title }}</span>
              <span v-naira="value"></span>
            </li>
          </ul>
        </u-card>
        <u-card class="rounded-l-none lg:col-span-3 md:col-span-2 bg-surface-light dark:bg-surface-dark">
          <template #header>
            <h2>Top 5 Products</h2>
          </template>
          <ul>
            <li
              class="flex justify-between items-center uppercase font-semibold mb-3 text-xs text-info"
            >
              <span>Product Name</span>
              <span>Quantity Sold</span>
            </li>
            <li
              v-for="{ name, count } in Top5Products"
              :key="name"
              class="flex justify-between items-center py-3 border-b border-primary/30 px-3"
            >
              <span class="uppercase font-semibold">{{ name }}</span>
              <span>{{ count }}</span>
            </li>
          </ul>
        </u-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useMyDataStore } from "~/stores/data";

const DataStore = useMyDataStore();

const {
  ProductInStock,
  ProductOutOfStock,
  Stocks,
  TotalSalesAmount,
  TotalExpenseAmount,
  Invoicepayments,
  Top5Products,
} = storeToRefs(DataStore);
</script>

<style></style>
