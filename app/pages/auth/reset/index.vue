<template>
  <div class="min-h-dvh flex items-center justify-center">
    <div v-if="email" class="max-w-xl w-full">
      <u-card class="py-10 text-center">
        <div>
          <h2 v-if="props.status == 'sent'" class="text-xl font-bold capitalize">
            A reset link has been sent to your email, please check the spam
            folder if you can't find it.
          </h2>
          <h2 v-else-if="props.status == 'sending'" class="text-xl font-bold capitalize">
            We are sending a password reset link to your email address
          </h2>
          <h2 class="text-xl font-bold capitalize">{{ props.msg }}</h2>

          <div class="mt-5">
            <u-button @click="email= ''" class="font-bold text-info">Resend Email</u-button>
          </div>
        </div>
      </u-card>
    </div>

    <div v-else class="max-w-xl w-full">
      <u-card class="py-10">
        <u-form-field label="Email Address" required class="mb-7">
          <u-input type="email" placeholder="Email Address" size="xl" class="max-w-2xl w-full" v-model="form.email" />
        </u-form-field>

        <u-button label="submit"  size="xl" variant="subtle" color="info" @click="formSubmit" />
      </u-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false
})
const route = useRoute();
const router = useRouter()
const e = route.query.email as string
const email = ref(e)
const form= reactive({
  email: ''
})

const props = ref({
  status: "sending",
  msg: "",
});

async function sendResetEmail() {
  try { 
    const res = await $fetch<{ statusCode: number }>(
      "/api/auth/send-reset-mail?email=" + email.value
    );
    if (res.statusCode === 200) {

      props.value.status = "sent";
    }
  } catch (error: any) {
    (props.value.status = "error"),
      (props.value.msg =
        error.statusMessage || "unknown error occured, try again later");
  }
}
if (email.value) {
  sendResetEmail();
}

function formSubmit() {
  if (form.email == '') {
    alert('Please enter a valid email')
  }else {
    email.value = form.email
    form.email = ''
  }
}

watch(() => email.value, (x)=> {
  sendResetEmail()
})
</script>

<style></style>
