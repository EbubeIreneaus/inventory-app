export const useForm = <T extends Record<string, any>>(initialForm: T) => {
  const formData = ref<T>({...initialForm})
  function reset(){formData.value = {...initialForm}}
  return {formData, reset}
}
