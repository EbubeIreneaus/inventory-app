<template>
  <div class="my-10">
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
                label: 'In-Stock',
                onSelect() {
                  filter = 'in-stock';
                },
              },
              {
                label: 'Out of Stock',
                onSelect(e) {
                  filter = 'out-of-stock';
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
              placeholder="Search Product"
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
      <u-table :data="Products" :columns="ColumnData"> </u-table>
    </u-card>
  </div>
</template>

<script lang="ts" setup>
import type { StockSelect } from "~/types";
import type { TableColumn } from "@nuxt/ui";
import { NairaFMT } from "~/lib";
const DataStore = useMyDataStore();
const { Stocks } = storeToRefs(DataStore);
const Link = resolveComponent("NuxtLink");
const DropDown = resolveComponent("UDropdownMenu");
const Button = resolveComponent("UButton");
const ColumnData: TableColumn<StockSelect>[] = [
  {
    accessorKey: "id",
    header: "Stock ID",
    cell: ({ row }) => {
      return `#${row.getValue("id")}`;
    },
  },
  {
    accessorKey: "productName",
    header: "Name",
    cell: ({ row }) => {
      return h("p", { class: "capitalize" }, `${row.getValue("productName")}`);
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantities",
    cell: ({ row }) => {
      return row.getValue("quantity");
    },
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    cell: ({ row }) => {
      return h("p", {}, NairaFMT(row.original.unitPrice || 0, "standard"));
    },
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
    cell: ({ row }) => {
      return h("p", {}, NairaFMT(row.original.sellingPrice || 0, "standard"));
    },
  },
  {
    accessorKey: "",
    header: "Action",
    cell: ({ row }) => {
      return h(
        DropDown,
        {
          content: {
            align: "end",
          },
          items: [
            {
              label: "Actions",
              type: "label",
            },
            {
              label: "View",
              icon: "mdi:eye",
              to: `/stock/${row.original.id}`,
            },
            {
              label: "Edit",
              icon: "mdi:pen",
              to: `/stock/${row.original.id}/edit`,
            },
          ],
        },
        h(Button, {
          icon: "lucide:ellipsis-vertical",
          variant: "ghost",
          color: "info",
        })
      );
    },
  },
];
const filter = ref<"all" | "in-stock" | "out-of-stock">("all");
const search = ref("");

const Products = computed(() => {
  const stocks = Stocks.value;
  if (search.value !== "") {
    const query = search.value.toLowerCase().split(" ");
    return stocks.filter((st) => {
      return query.some((q) => st.productName.toLowerCase().includes(q));
    });
  } else {
    let p = [];
    switch (filter.value) {
      case "in-stock":
        p = stocks.filter((st) => st.quantity > 0);
        break;
      case "out-of-stock":
        p = stocks.filter((st) => st.quantity <= 0);
        break;
      default:
        p = stocks;
    }
    return p;
  }
});
</script>

<style></style>
