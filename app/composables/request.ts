const toast = useToast();

export function useRequest() {
  const isLoading = ref(false);

  const request = async <T = any>({
    url,
    method = "GET",
    data,
    credentials = "include",
  }: {
    url: string;
    method?: "POST" | "GET" | "DELETE" | "PATCH";
    data?: object;
    credentials?: "include" | "omit";
  }): Promise<T | null> => {
    isLoading.value = true;

    try {
      const res = await $fetch<T>(url, {
        method,
        ...(data ? { body: data } : {}),
        credentials,
      });

      return res;
    } catch (error: any) {
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  return { request, isLoading };
}
