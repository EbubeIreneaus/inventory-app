<template>
  <div>
    <u-container class="min-h-dvh flex items-center">
      <u-card
        class="max-w-4xl mx-auto dark:bg-surface-dark bg-surface-light my-10 py-10"
      >
        <div class="grid lg:grid-cols-2 gap-y-8">
          <div class="grid place-content-center">
            <nuxt-img
              src="/images/authbg.png"
              width="400"
              height="400"
              alt="registeration background image"
              class="max-w-[90%] object-center object-cover"
              format="webp"
              densities="x1"
              quality="90"
            />
          </div>
          <div>
            <h1 class="mb-5 text-3xl font-bold uppercase">Welcome Back</h1>
            <form @submit.prevent="submit">
              <u-form-field label="Email" required class="mb-5">
                <u-input
                  class="w-full"
                  size="xl"
                  placeholder="Johndoe5@gmail.com"
                  type="email"
                  v-model="formData.email"
                />
              </u-form-field>
              <u-form-field label="Password" required class="mb-5">
                <u-input
                  class="w-full"
                  size="xl"
                  type="password"
                  v-model="formData.password"
                />
              </u-form-field>
              <div class="mb-5 flex justify-between items-center">
                <u-checkbox
                  label="Remember me"
                  class="mb-5"
                  v-model="formData.rememberme"
                />
                <nuxt-link class="text-info" href="/"
                  >Forget password?</nuxt-link
                >
              </div>
              <u-button
                label="Login"
                size="xl"
                class="mx-auto items-center flex"
                trailing-icon="lucide:lock-keyhole-open"
                :loading="isLoading"
                type="submit"
                variant="subtle"
                color="info"
              />
            </form>
         
          </div>
        </div>
      </u-card>
    </u-container>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false,
});

const DataStore = useMyDataStore()


const isLoading = ref(false);
const toast = useToast();
const router = useRouter();

const { formData, reset } = useForm({
  email: "",
  password: "",
  rememberme: false,
});

const submit = async () => {
  isLoading.value = true
  try {
    const res = await $fetch<any>("/api/auth/login", {
      method: "post",
      body: formData.value,
    });

    if (res.statusCode === 200) {
      DataStore.isLoggedIn = true
      DataStore.Auth = res.user
      return router.push("/");
    }
  } catch (error: any) {
    toast.add({
      title: "Request Failed",
      description: error.statusMessage || "Unexpected error occured",
      icon: "lucide:circle-x",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style></style>
