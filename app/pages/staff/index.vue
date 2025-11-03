<template>
  <div class="py-10">
    <u-card class="bg-surface-light dark:bg-surface-dark">
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
                label: 'Admin Previlage',
                onSelect() {
                  filter = 'admin';
                },
              },
              {
                label: 'Staff Previlage',
                onSelect(e) {
                  filter = 'staff';
                },
              },
              {
                label: 'Currently Online',
                onSelect(e) {
                  filter = 'online';
                },
              },
              {
                label: 'Currently Offline',
                onSelect(e) {
                  filter = 'offline';
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
        <u-table :data="StaffsData" :columns="columnData" />
      </div>
    </u-card>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumn } from "@nuxt/ui";
import type { UserSelect } from "~/types";
const DataStore = useMyDataStore();
const { Staffs } = storeToRefs(DataStore);
import { NairaFMT } from "~/lib";
import moment from "moment";

const search = ref("");
const filter = ref<
  | "staff"
  | "admin"
  | "regular employee"
  | "all"
  | "active"
  | "online"
  | "offline"
>("all");

const link = resolveComponent("NuxtLink");
const Icon = resolveComponent("UIcon");
const DropDown = resolveComponent("UDropdownMenu");
const Button = resolveComponent("UButton");
const columnData: TableColumn<UserSelect>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell({ row }) {
     return `#${row.getValue('id')}`
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell({ row }) {
      return h(
        "p",
        { class: "capitalize font-bold" },
        `${
          (row.original.firstname || "") + " " + (row.original.lastname || "")
        }`
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return row.getValue("email");
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return h("p", { class: "uppercase font-bold" }, row.getValue("role"));
    },
  },
  {
    accessorKey: "previlage",
    header: "Privilage",
    cell: ({ row }) => {
      return h(
        "p",
        { class: "uppercase font-bold" },
        row.getValue("previlage")
      );
    },
  },
  {
    accessorKey: "online",
    header: "Online",
    cell: ({ row }) => {
      const status = "offline";
      const Colors = {
        online: "success" as const,
        offline: "error" as const,
      };
      const Icons = {
        online: "lucide:circle-check" as const,
        offline: "lucide:circle-x" as const,
      };
      return h(Icon, {
        name: Icons[status],
        class: `text-${Colors[status]}`,
        size: "xl",
      });
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell({ row }) {
      return h(
        DropDown,
        {
          content: {
            align: "end",
          },
          items: [
            {
              label: "see details",
              icon: "lucide:user-round-search",
              to: `/staff/${row.original.id}`,
            },
            {
              label: "Deactivate",
              icon: "lucide:shield-user",
              color: "info",
            },
            {
              label: "Delete",
              icon: "lucide:trash-2",
              color: "error",
            },
          ],
        },
        h(Button, {
          icon: "lucide:ellipsis-vertical",
          variant: "none",
          color: "info",
          size: "lg",
        })
      );
    },
  },
];

const StaffsData = computed(() => {
  let data: UserSelect[] = [];
  if (search.value !== "") {
    const query = search.value.toLowerCase().trim().split(/\s+/);
    data = Staffs.value.filter((exp) => {
      return query.some(
        (q) =>
          q == String(exp.id) ||
          exp.firstname.toLowerCase().includes(q) ||
          exp.lastname.toLowerCase().includes(q)
      );
    });
  } else {
    if (filter.value) {
      data =
        filter.value !== "all"
          ? (data = Staffs.value.filter((exp) => {
              return exp.previlage == filter.value;
            }))
          : Staffs.value;
    }
  }

  return data;
});
</script>

<style></style>
