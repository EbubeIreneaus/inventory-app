<template>
  <div class="py-8">
    <u-card class="max-w-full w-full">
      <template #header>
        <h2 class="text-xl font-bold uppercase">Update Staff Information</h2>
      </template>
      <div>
        <form @submit.prevent="submit">
          <h2 class="text-lg font-bold uppercase">Presonal Information</h2>
          <div class="grid md:grid-cols-2 gap-x-5 md:gap-y-6 my-3 mb-7">
            <u-form-field label="First name" required>
              <u-input
                size="xl"
                placeholder="John"
                class="w-full"
                required
                v-model="formData.firstname"
              />
            </u-form-field>
            <u-form-field label="Last name" required>
              <u-input
                size="xl"
                placeholder="John"
                class="w-full"
                required
                v-model="formData.lastname"
              />
            </u-form-field>
            <u-form-field label="Email" required>
              <u-input
                type="email"
                size="xl"
                placeholder="johndoe@gmail.com"
                class="w-full"
                required
                v-model="formData.email"
              />
            </u-form-field>
            <u-form-field label="Date of Birth">
              <u-input
                size="xl"
                type="date"
                class="w-full"
                required
                v-model="formData.dob"
              />
            </u-form-field>
            <u-form-field label="Phone number">
              <u-input
                type="tel"
                size="xl"
                placeholder="08061982520"
                class="w-full"
                required
                v-model="formData.phone"
              />
            </u-form-field>
            <u-form-field label="Previlage">
              <u-select
                size="xl"
                :items="['admin', 'staff', 'none']"
                class="w-full"
                required
                v-model="formData.previlage"
              />
            </u-form-field>
            <u-form-field label="Role" required>
              <u-input
                size="xl"
                placeholder="Sales Boy"
                class="w-full"
                required
                v-model="formData.role"
              />
            </u-form-field>
          </div>
          <h2 class="text-lg font-bold uppercase">Address Information</h2>
          <div class="grid md:grid-cols-2 gap-x-5 md:gap-y-6 mt-3">
            <u-form-field label="State" required>
              <u-input
                size="xl"
                placeholder="Abuja"
                class="w-full"
                required
                v-model="formData.state"
              />
            </u-form-field>
            <u-form-field label="City" required>
              <u-input
                size="xl"
                placeholder="Kubwa"
                class="w-full"
                required
                v-model="formData.city"
              />
            </u-form-field>
            <u-form-field label="Address" required class="md:col-span-2">
              <u-input
                size="xl"
                placeholder="Block 38 julius berga camp, opp ckc catholic church"
                class="w-full"
                required
                v-model="formData.address"
              />
            </u-form-field>
          </div>

          <div class="mt-10 flex gap-x-5 flex-wrap">
            <u-button
              size="xl"
              label="Update User"
              color="info"
              variant="subtle"
              type="submit"
              :loading="isLoading"
            />
            <u-button size="xl" label="Reset" color="error" variant="subtle" />
          </div>
        </form>
      </div>
    </u-card>
  </div>
</template>

<script lang="ts" setup>
import type { UserInsert, UserSelect } from "~/types";
const isLoading = ref(false);
const toast = useToast();
const router = useRouter();
const DataStore = useMyDataStore()
const  {Staffs} = storeToRefs(DataStore)
const route = useRoute();
const { id } = route.params;

const staff = computed(() => {
  return Staffs.value.find(s => s.id == Number(id))
})

const { formData, reset } = useForm({
  firstname: staff.value?.firstname,
  lastname: staff.value?.lastname,
  email: staff.value?.email,
  dob: staff.value?.dob,
  address: staff.value?.address,
  city: staff.value?.city,
  previlage: staff.value?.previlage,
  phone: staff.value?.phone,
  state: staff.value?.state,
  role: staff.value?.role,

});

async function submit() {
  isLoading.value = true;
  try {
    const res = await $fetch(`/api/staff/${id}/update`, {
      method: "POST",
      body: formData.value,
    });
    if (res.statusCode == 200) {
      reset();
      toast.add({
        title: "Updated Successfully",
        icon: "lucide:user-round-check",
        color: "info",
      });
    }
  } catch (error: any) {
    return toast.add({
      color: "error",
      title: "Failed",
      description: error.statusMessage || "Unexpected error occured",
      icon: "lucide:triangle-alert",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<style></style>
