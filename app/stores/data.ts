import { defineStore } from "pinia";
import type {
  ExpenseSelect,
  InvoiceSelect,
  StockSelect,
  UserSelect,
} from "~/types";

const today = new Date();
today.setHours(0, 0, 0, 0);

const customDate = (days: number) => {
  const date = new Date(today);
  date.setDate(today.getDate() - days);
  return date;
};
const DateRange = {
  today: today,
  yesterday: customDate(-1),
  seven_days_ago: customDate(-7),
  thirty_days_ago: customDate(-30),
};

export const useMyDataStore = defineStore("data", () => {
  const filterDate = ref<keyof typeof DateRange>("today");
  const isLoggedIn = ref(false);
  const Auth = ref<UserSelect | null>(null);
  const Stocks = ref<StockSelect[]>([]);
  const Invoices = ref<InvoiceSelect[]>([]);
  const Expenses = ref<ExpenseSelect[]>([]);
  const Staffs = ref<UserSelect[]>([]);
  const ProductInStock = computed(() => {
    return Stocks.value.filter((stock) => stock.quantity > 1).length || 0;
  });
  const ProductOutOfStock = computed(() => {
    return Stocks.value.filter((stock) => stock.quantity < 1).length || 0;
  });
  const TotalSalesAmount = computed(() => {
    return Invoices.value.reduce((x, y) => x + Number(y.totalAmount), 0);
  });
  const TotalExpenseAmount = computed(() => {
    return Expenses.value.reduce((x, y) => x + Number(y.totalAmount), 0);
  });

  const Invoicepayments = computed(() => {
    let obj = {
      cash: 0,
      transfer: 0,
      debt: 0,
      card: 0,
    };
    for (const invoice of Invoices.value) {
      obj[invoice.paymentType] =
        (obj[invoice.paymentType] || 0) + Number(invoice.totalAmount);
    }
    let sortedArray = Object.entries(obj).sort(([, a], [, b]) => b - a);
    return sortedArray;
  });

  const Top5Products = computed(() => {
    let product: Record<string, number> = {};
    for (const invoice of Invoices.value) {
      for (const prd of invoice.products || []) {
        product[prd.name] = (product[prd.quantity] || 0) + Number(prd.quantity);
      }
    }
    return Object.entries(product)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  async function logout() {
    isLoggedIn.value = false;
    Auth.value = null;
  }

  async function fetchData() {
    const [products, invoices, expenses, staffs] = await Promise.all([
      (await $fetch(
        `/api/stock/all?startDate=${DateRange[filterDate.value]}`
      )) as StockSelect[],
      (await $fetch(
        `/api/invoice/all?startDate=${DateRange[filterDate.value]}`
      )) as InvoiceSelect[],

      (await $fetch(
        `/api/expense/all?startDate=${DateRange[filterDate.value]}`
      )) as ExpenseSelect[],
      (await $fetch(`/api/staff/all`)) as UserSelect[],
    ]);
    Stocks.value = products || [];
    Invoices.value = invoices || [];
    Expenses.value = expenses || [];
    Staffs.value = staffs;
  }
  fetchData();

  if (import.meta.client) {
    const event = new EventSource("/api/stream");

    if (event) {
      event.onmessage = (e) => {
        const data = JSON.parse(e.data);
        switch (data.key) {
          case "new_invoice":
            Invoices.value.push(data.data);
            break;
          case "new_expense":
            Expenses.value.push(data.data);
            break;
          case "new_stock":
            Stocks.value.push(data.data);
            break;
          case "update_stock":
            const ustockId = data.data.id;
            const uindex = Stocks.value.findIndex((s) => s.id == ustockId);
            if (uindex && uindex > -1) {
              Stocks.value[uindex] = data.data;
            }
            break;
          case "delete_stock":
            const dstockId = data.data.id;
            const dindex = Stocks.value.findIndex((s) => s.id == dstockId);
            if (dindex && dindex > -1) {
              Stocks.value.splice(dindex, 1);
            }
            break;

          default:
            break;
        }
      };
    }
  }

  return {
    Stocks,
    Expenses,
    Invoices,
    ProductInStock,
    ProductOutOfStock,
    TotalSalesAmount,
    TotalExpenseAmount,
    Invoicepayments,
    Top5Products,
    Staffs,
    Auth,
    logout,
    isLoggedIn,
  };
});
