import { db } from "~~/server/db";
import { userTable } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth as any;
    if (auth.previlage !== "admin") return [];

    const staff = await db.query.userTable.findMany();
    return staff;
  } catch (error) {
    return [];
  }
});
