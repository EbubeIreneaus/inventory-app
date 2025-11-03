import { and, gte, lte } from "drizzle-orm";
import { db } from "~~/server/db";
import { invoiceTable, userTable } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const stocks = db.query.stockTable.findMany();

    return stocks;
  } catch (error) {
    console.log(error);
    return null;
  }
});
