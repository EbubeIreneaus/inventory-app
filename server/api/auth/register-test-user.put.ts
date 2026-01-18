import jwt from "jsonwebtoken";
import { db } from "~~/server/db";
import { userTable } from "~~/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { eq, ilike } from "drizzle-orm";
import bcrypt from "bcryptjs";

const schema = createInsertSchema(userTable);
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  console.log("Api endpoint reached")
  const { data, error } = await readValidatedBody(event, schema.safeParse);

  if (error) {
    return createError({
      statusCode: 422,
      statusMessage: error.issues[0].message,
    });
  }
  console.log("Api endpoint rno error")

  try {
    const [existingUser] = await db
      .select({ email: userTable.email })
      .from(userTable)
      .where(ilike(userTable.email, data.email));

    if (existingUser) {
      return { statusCode: 200 };
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);

      console.log("Api endpoint ready to create user")


    // create user
    await db.insert(userTable).values({ ...data, password: hash });
     console.log("Api user created")
    return { statusCode: 201 };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || "Unknow error occured",
    });
  }
});
