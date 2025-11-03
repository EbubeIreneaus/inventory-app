const formatter = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    style: "currency",
    maximumFractionDigits: 2,
    notation: 'compact'
  }).format(amount);

};
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("naira", {
    mounted(el, binding) {
      el.innerText = formatter(Number(binding.value));
    },
    updated(el, binding) {
      el.innerText = formatter(Number(binding.value));
    },
    getSSRProps() {
      return {};
    },
  });
});
