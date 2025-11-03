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
        <u-table :data="ExpensesData" :columns="columnData" />
      </div>
    </u-card>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumn } from "@nuxt/ui";
import type { ExpenseSelect } from "~/types";
const DataStore = useMyDataStore();
const { Expenses } = storeToRefs(DataStore);
import { NairaFMT } from "~/lib";
import moment from "moment";

const search = ref("");
const filter = ref<"all" | "cash" | "transfer" | "debt" | "card">("all");

const link = resolveComponent("NuxtLink");
const columnData: TableColumn<ExpenseSelect>[] = [
  {
    accessorKey: "id",
    header: "Invoice ID",
    cell({ row }) {
      return h(
        link,
        {
          to: `/expense/${row.getValue("id")}`,
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
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return row.getValue("category");
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

const ExpensesData = computed(() => {
  let data: ExpenseSelect[] = [];
  if (search.value !== "") {
    const query = search.value.toLowerCase().trim().split(/\s+/);
    data = Expenses.value.filter((exp) => {
      return query.some(
        (q) =>
          q == String(exp.id) ||
          exp.user?.firstname.toLowerCase().includes(q) ||
          exp.user?.lastname.toLowerCase().includes(q)
      );
    });
  } else {
    if (filter.value) {
      data =
        filter.value !== "all"
          ? (data = Expenses.value.filter((exp) => {
              return (
                exp.paymentType == filter.value || exp.category == filter.value
              );
            }))
          : Expenses.value;
    }
  }

  return data;
});
</script>

<style></style>
