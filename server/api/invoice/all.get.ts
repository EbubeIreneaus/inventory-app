import { and, gte, lte } from "drizzle-orm";
import { db } from "~~/server/db";
import { invoiceTable, userTable } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  try {
    let { startDate, endDate } = getQuery(event) as {
      startDate: any;
      endDate: any;
    };

    startDate = new Date(startDate)
    endDate =  endDate ? new Date(endDate): new Date(startDate)
    endDate.setHours(23, 59, 59, 999);

    const invoice = db.query.invoiceTable.findMany({
      where: and(
        gte(userTable.createdAt, startDate),
        lte(userTable.createdAt, endDate)
      ),
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

    return invoice;
  } catch (error) {
    console.log(error);
    return null;
  }
});
