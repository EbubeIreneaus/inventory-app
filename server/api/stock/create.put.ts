import { db } from "~~/server/db";
import { stockTable, userTable } from "~~/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { eq, ilike } from "drizzle-orm";

const schema = createInsertSchema(stockTable);
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
    const [insert] = await db.insert(stockTable).values(data).returning();
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
