import { db } from "~~/server/db";
import { userTable } from "~~/server/db/schema";
import { createUpdateSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";

const schema = createUpdateSchema(userTable);
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
    const { error, data } = await readValidatedBody(event, schema.safeParse);
    if (error) {
      return createError({
        statusCode: 422,
        statusMessage: error?.issues[0].message,
      });
    }

    const [user] = await db
      .update(userTable)
      .set(data)
      .where(eq(userTable.id, Number(id)))
      .returning();
    return { statusCode: 200, user };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || "unknown server error occured",
    });
  }
});
