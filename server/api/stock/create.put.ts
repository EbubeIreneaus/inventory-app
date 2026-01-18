import { db } from "~~/server/db";
import { stockTable, userTable } from "~~/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { eq, ilike, InferInsertModel } from "drizzle-orm";

export type StockInsert = InferInsertModel<typeof stockTable>

import z from 'zod'

const baseSchema = createInsertSchema(stockTable);

const schema = baseSchema.extend({
  quantity: z.number().min(1, {error: 'quantity should be atleast 1'}),
  unitPrice: z.coerce.number().min(0),
  productName: z.string().min(2, {error: 'invalid product name'})
})

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.auth;
    if (!user || user.previlage !== "admin") {
      return createError({
        statusMessage: "Unauthorize access",
        statusCode: 422,
      });
    }
    const { data, error } = await readValidatedBody(event, schema.safeParse);
    if (error) {
      return createError({
        statusMessage: error.issues[0].message,
        statusCode: 422,
      });
    }

    const existingProduct = await db.query.stockTable.findFirst({
      where: ilike(stockTable.productName, data.productName),
    });
    if (existingProduct) {
      return createError({
        statusMessage:
          "similar product found, similar productID:" + existingProduct.id,
        statusCode: 422,
      });
    }
    const [insert] = await db.insert(stockTable).values(data as unknown as StockInsert).returning();
    broadcast({key: 'new_stock', data: insert})
    return { statusCode: 201 };
  } catch (error: any) {
    return createError({
      statusMessage:
        error.message || error.statusMessage || "unknown server error occured",
      statusCode: 500,
    });
  }
});
