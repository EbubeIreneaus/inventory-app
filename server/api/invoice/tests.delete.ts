import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { invoiceTable, userTable } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const [tester] = await db
      .select({ id: userTable.id, email: userTable.email })
      .from(userTable)
      .where(eq(userTable.email, "tester@gmail.com"));

    const deleted = await db
      .delete(invoiceTable)
      .where(eq(invoiceTable.userId, tester.id || 1))
      .returning();
    // broadcast({ key: "delete_invoice", data: invoice });

    if (deleted.length === 0) {
      return createError({
        statusCode: 404,
        statusMessage: "Invoice not found",
      });
    }

    return { success: true, statusCode: 200 };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || "unknown server error occured",
    });
  }
});
