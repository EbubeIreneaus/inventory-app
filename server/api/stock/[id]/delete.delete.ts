import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { stockTable } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (isNaN(Number(id))) {
      return createError({
        statusCode: 422,
        statusMessage: "Invalid Stock Id",
      });
    }
    const [stock] = await db
      .delete(stockTable)
      .where(eq(stockTable.id, Number(id)))
      .returning();
    broadcast({ key: "delete_stock", data: stock });

    return { statusCode: 200, stock };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || "unknown server error occured",
    });
  }
});
