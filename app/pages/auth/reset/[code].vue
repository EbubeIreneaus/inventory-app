<template>
  <div>
    <u-container class="max-w-xl py-20">
      <form @submit.prevent="submit">
        <u-form-field label="New Password" class="mb-7">
          <u-input
            size="xl"
            class="w-full"
            v-model="formData.password"
            type="password"
          />
        </u-form-field>
        <u-form-field label="Confirm" class="mb-7">
          <u-input
            size="xl"
            class="w-full"
            v-model="formData.confirm"
            type="password"
          />
        </u-form-field>

        <u-button
          label="Reset Password"
          size="xl"
          variant="subtle"
          color="info"
          :loading="isLoading"
          type="submit"
        />
      </form>
    </u-container>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false,
});

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const toast = useToast();

const { formData, reset } = useForm({
  password: "",
  confirm: "",
});

async function submit() {
  try {
    isLoading.value = true;
    const res = await $fetch("/api/auth/reset-forget-password", {
      method: "POST",
      body: { ...formData.value, token: route.params.code },
    });

    if (res.statusCode == 200) {
      toast.add({
        title: "password updated successfully",
        color: "info",
        icon: "mdi:check-circle-outline",
      });
      router.push("/auth/login");
    }
  } catch (error: any) {
    toast.add({
      title: error.statusMessage,
      color: "error",
      icon: "lucide:triangle-alert",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<style></style>
