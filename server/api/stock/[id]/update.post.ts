import { db } from "~~/server/db";
import { stockTable } from "~~/server/db/schema";
import { createUpdateSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";

const schema = createUpdateSchema(stockTable);
export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (isNaN(Number(id))) {
      return createError({
        statusCode: 422,
        statusMessage: "Invalid Stock Id",
      });
    }
    const { error, data } = await readValidatedBody(event, schema.safeParse);
    if (error) {
      return createError({
        statusCode: 422,
        statusMessage: error?.issues[0].message,
      });
    }

    const [stock] = await db
      .update(stockTable)
      .set(data)
      .where(eq(stockTable.id, Number(id)))
      .returning();
    
      broadcast({key: 'update_stock', data: stock})

    return { statusCode: 200, stock };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || "unknown server error occured",
    });
  }
});
