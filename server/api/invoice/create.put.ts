import { db } from "~~/server/db";
import { invoiceTable, stockTable, userTable } from "~~/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { eq, ilike, sql } from "drizzle-orm";
import { broadcast } from "~~/server/utils/broadcast";

const schema = createInsertSchema(invoiceTable);
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

    const totalAmount = data.products?.reduce(
      (x, y) => x + Number(y.amount),
      0
    );

    await db.transaction(async (tx) => {
      for (const product of data.products || []) {
        await tx
          .update(stockTable)
          .set({
            quantity: sql`${stockTable.quantity} - ${product.quantity}`,
          })
          .where(eq(stockTable.id, product.id));
      }
    });

    const [invoice] = await db
      .insert(invoiceTable)
      .values({
        ...data,
        userId: user.id,
        totalAmount: String(totalAmount),
      })
      .returning({ id: invoiceTable.id });

    const q = await db.query.invoiceTable.findFirst({
      where: eq(invoiceTable.id, invoice.id),
      with: {
        user: {
          columns: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    try {
      const msg = { key: "new_invoice", data: q };
      broadcast(msg); //broadcast to all user
    } catch (error) {
      console.log(error);
    }

    return { statusCode: 201, invoiceId: invoice.id };
  } catch (error: any) {
    return createError({
      statusMessage:
        error.message || error.statusMessage || "unknown server error occured",
      statusCode: 500,
    });
  }
});
