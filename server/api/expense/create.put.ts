import { db } from "~~/server/db";
import { expensesTable, notifcationTable, userTable } from "~~/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { eq, ilike } from "drizzle-orm";
import { adminBroadcast, broadcast } from "#imports";

const schema = createInsertSchema(expensesTable);
export default defineEventHandler(async (event) => {
  try {
    const user = event.context.auth;

    const { data, error } = await readValidatedBody(event, schema.safeParse);
    if (error) {
      return createError({
        statusMessage: error.issues[0].message,
        statusCode: 422,
      });
    }

    const [insert] = await db.insert(expensesTable).values({ ...data, userId: user.id }).returning({id: expensesTable.id});

    const expense = await db.query.expensesTable.findFirst({
      where: eq(expensesTable.id, insert.id),
      with: {
        user: {
          columns: {
            id: true,
            firstname: true,
            lastname: true,
          }
        }
      }
    })

    await db.insert(notifcationTable).values({
      title: 'New Expenses Created',
      content: `${expense?.user?.firstname} just recorded an expense of ₦${expense?.totalAmount}. Expenses ID: ${expense?.id} `,
      to: 'all'
    })
    broadcast({key: 'new_expense', data: expense})
    return { statusCode: 201, insertId: expense?.id };
  } catch (error: any) {
    return createError({
      statusMessage:
        error.message || error.statusMessage || "unknown server error occured",
      statusCode: 500,
    });
  }
});
