<template>
  <div class="py-10">
    <u-card>
      <template #header>
        <div class="flex justify-between itmes-center mb-3 py-3">
          <u-dropdown-menu
            :content="{ align: 'end' }"
            :ui="{ item: 'py-3' }"
            :items="[
              {
                label: 'All',
                onSelect() {
                  filter = 'all';
                },
              },
              {
                label: 'Cash',
                onSelect() {
                  filter = 'cash';
                },
              },
              {
                label: 'Transfer',
                onSelect(e) {
                  filter = 'transfer';
                },
              },
              {
                label: 'Debt',
                onSelect(e) {
                  filter = 'debt';
                },
              },
              {
                label: 'Card',
                onSelect(e) {
                  filter = 'card';
                },
              },
            ]"
          >
            <u-button
              icon="mdi:tune-variant"
              :label="filter"
              class="px-10 capitalize"
              variant="outline"
              color="secondary"
              size="xl"
            />
          </u-dropdown-menu>
          <div class="flex items-center">
            <u-input
              type="search"
              size="xl"
              placeholder="Search"
              :ui="{
                base: 'rounded-r-none max-w-xl w-full',
              }"
              v-model="search"
            />
            <u-button
              icon="mdi:magnify"
              size="xl"
              class="rounded-l-none"
              color="success"
            />
          </div>
        </div>
      </template>
      <div>
        <u-table :data="InvoiceData" :columns="columnData" />
      </div>
    </u-card>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumn } from "@nuxt/ui";
import type { InvoiceSelect } from "~/types";
const DataStore = useMyDataStore();
const { Invoices } = storeToRefs(DataStore);
import { NairaFMT } from "~/lib";
import moment from "moment";

const search = ref("");
const filter = ref<"all" | "cash" | "transfer" | "debt" | "card">("all");

const link = resolveComponent("NuxtLink");
const columnData: TableColumn<InvoiceSelect>[] = [
  {
    accessorKey: "id",
    header: "Invoice ID",
    cell({ row }) {
      return h(
        link,
        {
          to: `/invoice/${row.getValue("id")}`,
          class: "text-lg text-info underline underline-offset-2 font-bold",
        },
        `#${row.getValue("id")}`
      );
    },
  },
  {
    accessorKey: "userId",
    header: "Staff",
    cell({ row }) {
      return h(
        "p",
        { class: "capitalize font-bold" },
        `${
          (row.original.user?.firstname || "") +
          " " +
          (row.original.user?.lastname || "")
        }`
      );
    },
  },
  {
    accessorKey: "products",
    header: "No of Product",
    cell: ({ row }) => {
      return row.original.products?.length || 0;
    },
  },
  {
    accessorKey: "paymentType",
    header: "Payment",
    cell: ({ row }) => {
      return h(
        "p",
        { class: "uppercase font-bold" },
        row.getValue("paymentType")
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => {
      return NairaFMT(row.getValue("totalAmount"), "standard");
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return moment(row.getValue("createdAt")).fromNow(true);
    },
  },
];

const InvoiceData = computed(() => {
  let data: InvoiceSelect[] = [];
  if (search.value !== "") {
    const query = search.value.toLowerCase().trim().split(/\s+/);
    data = Invoices.value.filter((invoice) => {
      return query.some(
        (q) =>
          q == String(invoice.id)  ||
          invoice.user?.firstname.toLowerCase().includes(q) ||
          invoice.user?.lastname.toLowerCase().includes(q) 
      );
    });
  } else {
    switch (filter.value) {
      case "card":
        data = Invoices.value.filter((i) => i.paymentType == "card");
        break;
      case "transfer":
        data = Invoices.value.filter((i) => i.paymentType == "transfer");
        break;
      case "debt":
        data = Invoices.value.filter((i) => i.paymentType == "debt");
        break;
      default:
        data = Invoices.value;
    }
  }

  return data;
});
</script>

<style></style>
