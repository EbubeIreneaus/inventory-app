import { db } from "~~/server/db";
import { userTable } from "~~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    const auth = event.context.auth

    if (!auth || auth.previlage !== 'admin') {
      return createError({
        statusCode: 422,
        statusMessage: "unauthorize access",
      });
    }

    if (isNaN(Number(id))) {
      return createError({
        statusCode: 422,
        statusMessage: "Invalid user Id",
      });
    }


    const [user] = await db
      .delete(userTable)
      .where(eq(userTable.id, Number(id)))
      .returning();
      
    return { statusCode: 200 };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || "unknown server error occured",
    });
  }
});
