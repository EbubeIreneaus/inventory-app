<template>
  <div>
    <aside
      class="fixed max-w-0 w-full opacity-0 bg-surface-light dark:bg-surface-dark min-h-screen z-50 top-0 transition-all duration-300 ease-linear"
      :class="{ 'max-w-[20%] opacity-100': asideOpen }"
    >
      <div class="py-10 mt-8">
        <div>
          <u-navigation-menu orientation="vertical" :items="AsideLinks" />
        </div>
      </div>
    </aside>

    <div
      class="max-w-[dvw] w-full transition-all duration-300 ease-linear"
      :class="{ 'max-w-[80%] ml-[20%]': asideOpen }"
    >
      <header class="bg-surface-light dark:bg-surface-dark">
        <u-container class="flex justify-between items-center py-4">
          <div class="flex items-center gap-x-4">
            <u-button
              icon="lucide:menu"
              variant="ghost"
              size="lg"
              @click="asideOpen = !asideOpen"
            />
            <h1 class="text-xl font-extrabold capitalize">WELCOME BACK, {{ user.fullname.split(' ')[1] || user.fullname.split(' ')[0]  }}!</h1>
          </div>
          <div>
            <u-button icon="lucide:sun" variant="subtle" class="dark:hidden" />
            <u-button
              icon="lucide:moon"
              variant="subtle"
              class="hidden dark:block"
            />
          </div>
        </u-container>
      </header>

      <u-container>
        <slot />
      </u-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BusinessSelect, UserSelect } from '~/types';
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute();
const {id} = route.params

const AsideLinks = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Home',
      icon: 'lucide:layout-dashboard',
      to: `/business/${id}`
    },
    {
      label: 'Stock',
      icon: 'lucide:warehouse',
      children:[
        {
          label: 'Record New',
          icon: 'mdi:cart-plus'
        }
      ]
    }
  ]
])
 

const asideOpen = ref(true);

const [user, business] = await Promise.all([
   $fetch('/api/dashboard/user/info', {credentials: 'same-origin'}) as unknown as UserSelect,
   $fetch('/api/dashboard/business/info?id='+route.params.id, {credentials: 'same-origin'}) as unknown as BusinessSelect
])
</script>

<style></style>
