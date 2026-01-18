<template>
  <div>
    <aside
      class="fixed max-w-0 w-full opacity-0 bg-surface-light dark:bg-surface-dark min-h-screen z-50 top-0 transition-all duration-300 ease-linear"
      :class="{
        'lg:max-w-[20%] md:max-w-[50%] sm:max-w-[70%] max-w-[90%] opacity-100 shadow-md lg:shadow-none shadow-secondary/30':
          asideOpen,
      }"
    >
      <div class="p-3 lg:hidden">
        <u-button
          icon="lucide:x"
          color="error"
          variant="ghost"
          class="float-right"
          @click="asideOpen = false"
        />
      </div>
      <div class="py-5 mt-5 px-2">
        <div class="flex-1 text-center capitalize mb-5">
          <h2 class="text-xl font-semibold opacity-40">
            {{ user?.firstname }} {{ user?.lastname }}
          </h2>
          <p class="text-sm text-gray-500">{{ user?.role }}</p>
          <p class="text-sm text-gray-500">
            {{ user?.previlage }}, {{ user?.state }}
          </p>
        </div>
        <div>
          <u-navigation-menu
            orientation="vertical"
            :items="AsideLinks"
            color="neutral"
            :ui="{
              item: '',
              link: 'py-3 items-center text-base ',
            }"
          >
            <template #item="{ item }">
              <NuxtLink
                v-if="item.to"
                :to="item.to"
                class=" items-center text-base link"
              >
                {{ item.label }}
              </NuxtLink>

              <div v-else class="">
                {{ item.label }}
              </div>
            </template>
          </u-navigation-menu>
        </div>
      </div>
    </aside>

    <div
      class="max-w-[dvw] w-full transition-all duration-300 ease-linear"
      :class="{ 'lg:max-w-[80%] w-full lg:ml-[20%]': asideOpen }"
    >
      <header class="bg-surface-light dark:bg-surface-dark">
        <u-container class="flex justify-between items-center py-4">
          <div class="flex items-center gap-x-4">
            <u-button
              icon="lucide:menu"
              variant="ghost"
              size="lg"
              @click="asideOpen = !asideOpen"
              color="secondary"
            />
            <h1 class="text-xl font-extrabold capitalize">
              WELCOME BACK, {{ user?.firstname }}!
            </h1>
          </div>
          <div class="flex items-center gap-x-3">
            <u-button
              icon="lucide:moon"
              variant="ghost"
              class="dark:hidden"
              color="secondary"
              @click="toggleColorMode('dark')"
            />
            <u-button
              icon="lucide:sun"
              variant="ghost"
              class="hidden dark:block"
              color="secondary"
              @click="toggleColorMode('light')"
            />
            <u-button
              icon="lucide:bell-ring"
              variant="ghost"
              class=""
              color="secondary"
            />
          </div>
        </u-container>
      </header>

      <div class="px-5">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UserSelect } from "~/types";
import type { NavigationMenuItem } from "@nuxt/ui";
definePageMeta({});

const colorMode = useColorMode();

const DataStore = useMyDataStore();
const { Auth } = storeToRefs(DataStore);

const user = computed(() => Auth.value);

const route = useRoute();
const { id } = route.params;

const AsideLinks = ref<NavigationMenuItem[][]>([
  [
    {
      label: "Home",
      icon: "lucide:layout-dashboard",
      to: `/`,
      active: route.path.endsWith("/"),
      class: "link",
      testId: 'nav_home'
    },
    {
      label: "Stock",
      icon: "lucide:warehouse",
      children: [
        {
          label: "Record New",
          icon: "mdi:cart-plus",
          to: "/stock/create",
          class: "link",
        },
        {
          label: "View All",
          icon: "mdi:eye",
          to: "/stock",
          class: "link",
        },
      ],
    },
    {
      label: "Invoice",
      icon: "mdi:invoice-check-outline",
      children: [
        {
          label: "Create",
          icon: "lucide:receipt-cent",
          to: "/invoice/create",
          active: route.path.endsWith("/invoice/create"),
          class: "link",
        },
        {
          label: "View All",
          icon: "lucide:receipt-text",
          to: "/invoice",
          active: route.path.endsWith("/invoice"),
          class: "link",
        },
      ],
    },
    {
      label: "Expenses",
      icon: "mdi:cash-minus",
      children: [
        {
          label: "Create",
          icon: "mdi:cash-edit",
          to: "/expense/create",
          active: route.path.endsWith("/expense/create"),
          class: "link",
        },
        {
          label: "View All",
          icon: "mdi:cash-register",
          to: "/expense",
          active: route.path.endsWith("/expense"),
          class: "link",
        },
      ],
    },
    {
      label: "Staff",
      icon: "lucide:user",
      children: [
        {
          label: "Create",
          icon: "lucide:user-plus",
          to: "/staff/create",
          active: route.path.endsWith("staff/create"),
          class: "link",
        },
        {
          label: "View All",
          icon: "lucide:users",
          to: "/staff",
          active: route.path.endsWith("/staff"),
          class: "link",
        },
      ],
    },
    {
      label: "Notifications",
      icon: "lucide:bell",
      to: "/notifcation/",
      class: "link",
    },
    {
      label: "Profile",
      icon: "lucide:user-cog",
      to: "/profile",
      class: "link",
    },
    {
      label: "Logout",
      icon: "lucide:log-out",
      to: "/auth/logout",
      class: "link",
    },
  ],
]);

const asideOpen = ref(false);

function toggleColorMode(mode: "light" | "dark") {
  colorMode.preference = mode;
}

watch(
  () => route.fullPath,
  () => {
    if (window.innerWidth < 1024) {
      asideOpen.value = false;
    }
  }
);

onMounted(() => {
  if (window.innerWidth >= 1024) {
    asideOpen.value = true;
  }
});
</script>

<style></style>
